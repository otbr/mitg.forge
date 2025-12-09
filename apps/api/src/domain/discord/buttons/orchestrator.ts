import type { ButtonInteraction, Interaction } from "discord.js";
import { inject, injectable } from "tsyringe";
import type { Logger } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import type { DiscordButtonHandler } from "./base";
import { parseButtonId } from "./custom-ids";

@injectable()
export class DiscordButtonsOrchestrator {
	private readonly handlers: Map<string, DiscordButtonHandler<unknown>>;

	constructor(
		@inject(TOKENS.Logger) private readonly logger: Logger,
		@inject(TOKENS.DiscordAccountShowButtonHandler)
		private readonly accountShowButtonHandler: DiscordButtonHandler<unknown>,
	) {
		const handlerList: DiscordButtonHandler<unknown>[] = [
			this.accountShowButtonHandler,
		];

		this.handlers = new Map<string, DiscordButtonHandler<unknown>>();

		for (const handler of handlerList) {
			const existing = this.handlers.get(handler.prefix);

			if (existing) {
				this.logger.error(
					`[DiscordButtonsOrchestrator] Duplicate handler prefix detected: ${handler.prefix}`,
				);

				if (env.isDev) {
					throw new Error(
						`Duplicate handler prefix detected: ${handler.prefix}`,
					);
				}

				continue;
			}

			this.handlers.set(handler.prefix, handler);
		}
	}

	async handle(interaction: Interaction): Promise<void> {
		if (!interaction.isButton()) {
			this.logger.warn(
				`[DiscordButtonsOrchestrator] Unsupported interaction type: ${interaction.type}`,
			);
			return;
		}

		const buttonInteraction = interaction as ButtonInteraction;

		const [prefix] = buttonInteraction.customId.split(":");
		const handler = this.handlers.get(prefix);

		if (!handler) {
			this.logger.error(
				`[DiscordButtonsOrchestrator] No handler found for button with prefix: ${prefix}`,
			);
			return;
		}

		const payload = parseButtonId({
			customId: buttonInteraction.customId,
			expectedPrefix: handler.prefix,
			schema: handler.schema,
		});

		await handler.handle(buttonInteraction, payload);
	}
}
