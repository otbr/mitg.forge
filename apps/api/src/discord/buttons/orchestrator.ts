import type { ButtonInteraction, Interaction } from "discord.js";
import { type DependencyContainer, inject, injectable } from "tsyringe";
import type { DiscordButtonHandler } from "@/discord/buttons/base";
import { parseButtonId } from "@/discord/buttons/custom-ids";
import type { DiscordMiddleware } from "@/discord/middlewares/base";
import type { ExecutionContext } from "@/domain/context";
import type { Logger } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";

const BUTTONS_HANDLER_TOKENS = [
	TOKENS.DiscordAccountShowButtonHandler,
] as const;

const GLOBAL_MIDDLEWARE_TOKENS = [] as const;

@injectable()
export class DiscordButtonsOrchestrator {
	constructor(@inject(TOKENS.Logger) private readonly logger: Logger) {}

	async buttonsMap(scope: DependencyContainer) {
		const map = new Map<string, DiscordButtonHandler<unknown>>();

		for (const handler of BUTTONS_HANDLER_TOKENS) {
			const resolved = scope.resolve<DiscordButtonHandler<unknown>>(handler);

			if (map.has(resolved.prefix)) {
				this.logger.error(
					`[DiscordButtonsOrchestrator] Duplicate button handler prefix detected: ${resolved.prefix}`,
				);

				if (env.isDev) {
					throw new Error(
						`[DiscordButtonsOrchestrator] Duplicate button handler prefix detected: ${resolved.prefix}`,
					);
				}

				continue;
			}

			map.set(resolved.prefix, resolved);
		}

		return map;
	}

	async handle(
		interaction: Interaction,
		scope: DependencyContainer,
	): Promise<void> {
		if (!interaction.isButton()) {
			this.logger.warn(
				`[DiscordButtonsOrchestrator] Unsupported interaction type: ${interaction.type}`,
			);
			return;
		}

		const buttonInteraction = interaction as ButtonInteraction;

		const ctx = scope.resolve<ExecutionContext>(TOKENS.ExecutionContext);
		const handlers = await this.buttonsMap(scope);

		const [prefix] = buttonInteraction.customId.split(":");
		const button = handlers.get(prefix);

		if (!button) {
			this.logger.error(
				`[DiscordButtonsOrchestrator] No handler found for button with prefix: ${prefix}`,
			);
			return;
		}

		const globalMiddlewares = GLOBAL_MIDDLEWARE_TOKENS.map((token) =>
			scope.resolve<DiscordMiddleware>(token),
		);

		const handlerMiddlewares = button.middlewares.map((token) =>
			scope.resolve<DiscordMiddleware>(token),
		);

		const allMiddlewares = [...globalMiddlewares, ...handlerMiddlewares];

		const payload = parseButtonId({
			customId: buttonInteraction.customId,
			expectedPrefix: button.prefix,
			schema: button.schema,
		});

		const runner = allMiddlewares.reverse().reduce<() => Promise<void>>(
			(next, mw) => () => mw.handle(buttonInteraction, ctx, next, button),
			() => button.handle(buttonInteraction, payload, ctx),
		);

		await runner();
	}
}
