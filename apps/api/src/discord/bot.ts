import { type Interaction, MessageFlags } from "discord.js";
import { container, inject, injectable } from "tsyringe";
import type { DiscordMiddleware } from "@/discord/middlewares/base";
import { DiscordError } from "@/discord/utils/error";
import type { DiscordClient } from "@/domain/clients";
import {
	DiscordExecutionContext,
	type ExecutionContext,
} from "@/domain/context";
import type { Logger } from "@/domain/modules";
import { createDiscordContainer } from "@/infra/di/discordContainer";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";

function getDiscordErrorCode(error: unknown): number | undefined {
	// biome-ignore lint/suspicious/noExplicitAny: <any>
	const anyErr = error as any;
	return anyErr?.code ?? anyErr?.rawError?.code;
}

const GLOBAL_MIDDLEWARE_TOKENS = [TOKENS.DiscordSessionMiddleware] as const;

@injectable()
export class DiscordBot {
	private started = false;

	constructor(
		@inject(TOKENS.Logger) private readonly logger: Logger,
		@inject(TOKENS.DiscordClient) private readonly discordClient: DiscordClient,
	) {}

	async start(): Promise<void> {
		if (!env.DISCORD_ENABLED) {
			this.logger.info("[Discord] bot is disabled. Skipping startup.");
			return;
		}

		if (this.started) {
			this.logger.warn("[Discord] bot is already started. Skipping startup.");
			return;
		}

		await this.discordClient.start();
		this.started = true;

		const childContainer = container.createChildContainer();
		const execContext: ExecutionContext = new DiscordExecutionContext();
		childContainer.registerInstance(TOKENS.ExecutionContext, execContext);

		const localCommandsOrchestrator = childContainer.resolve(
			TOKENS.DiscordCommandsOrchestrator,
		);

		await localCommandsOrchestrator.registerCommands(childContainer);

		this.discordClient.onInteraction(async (interaction: Interaction) => {
			if (
				!interaction.guildId ||
				interaction.guildId !== env.DISCORD_GUILD_ID
			) {
				this.logger.warn(
					`[Discord] Interaction received from unsupported guild: ${interaction.guildId}`,
				);

				if (interaction.isRepliable()) {
					await interaction.reply({
						content: "This bot is not available in this server.",
						flags: MessageFlags.Ephemeral,
					});
				}
			}

			const { scope, ctx } = createDiscordContainer(interaction);
			const logger = scope.resolve<Logger>(TOKENS.Logger);

			const globalMiddlewares = GLOBAL_MIDDLEWARE_TOKENS.map((token) =>
				scope.resolve<DiscordMiddleware>(token),
			);

			const runner = globalMiddlewares.reverse().reduce<() => Promise<void>>(
				(next, mw) => () => mw.handle(interaction, ctx, next),
				() => Promise.resolve(),
			);

			await runner();

			logger.info(`[Discord] Received interaction of type ${interaction.type}`);

			const commandsOrchestrator = scope.resolve(
				TOKENS.DiscordCommandsOrchestrator,
			);
			const buttonsOrchestrator = scope.resolve(
				TOKENS.DiscordButtonsOrchestrator,
			);

			try {
				if (interaction.isChatInputCommand()) {
					return await commandsOrchestrator.handle(interaction, scope);
				}

				if (interaction.isButton()) {
					return await buttonsOrchestrator.handle(interaction, scope);
				}
			} catch (error) {
				if (DiscordError.is(error)) {
					logger.info(
						`[Discord] DiscordError occurred: ${error.code} - ${error.message}`,
					);

					if (
						interaction.isRepliable() &&
						!interaction.replied &&
						!interaction.deferred
					) {
						const content =
							error.userMessage ?? "Ocorreu um erro ao processar esta ação.";
						try {
							await interaction.reply({
								content,
								flags: MessageFlags.Ephemeral,
							});
						} catch (replyError) {
							const replyCode = getDiscordErrorCode(replyError);
							this.logger.error("[Discord] Failed to send domain error reply", {
								code: replyCode,
								error: replyError,
							});
						}
					}
					return;
				}

				const code = getDiscordErrorCode(error);

				// On HMR/dev is common to discord throw 10062/40060, so we just ignore these errors
				if (code === 10062 || code === 40060) {
					return;
				}

				logger.error(
					`[Discord] Error handling interaction of type ${interaction.type}`,
				);
				console.error(error);

				if (
					!interaction.isRepliable() ||
					interaction.replied ||
					interaction.deferred
				) {
					return;
				}

				try {
					await interaction.reply({
						content: "There was an error while processing this action.",
						flags: MessageFlags.Ephemeral,
					});
				} catch (replyError) {
					const replyCode = getDiscordErrorCode(replyError);
					logger.error("[Discord] Failed to send error reply", {
						code: replyCode,
						error: replyError,
					});
				}
			}
		});
	}

	async stop(): Promise<void> {
		if (!this.started) {
			this.logger.warn("[Discord] bot is not started. Skipping shutdown.");
			return;
		}

		await this.discordClient.stop();
		this.started = false;

		this.logger.info("[Discord] bot has been stopped.");
	}
}
