import { type Interaction, MessageFlags } from "discord.js";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import type { DiscordClient } from "../clients";
import type { Logger } from "../modules";
import type { DiscordButtonsOrchestrator } from "./buttons/orchestrator";
import type { DiscordCommandsOrchestrator } from "./commands";

function getDiscordErrorCode(error: unknown): number | undefined {
	// biome-ignore lint/suspicious/noExplicitAny: <any>
	const anyErr = error as any;
	return anyErr?.code ?? anyErr?.rawError?.code;
}

@injectable()
export class DiscordBot {
	private started = false;

	constructor(
		@inject(TOKENS.Logger) private readonly logger: Logger,
		@inject(TOKENS.DiscordClient) private readonly discordClient: DiscordClient,
		@inject(TOKENS.DiscordCommandsOrchestrator)
		private readonly commandsOrchestrator: DiscordCommandsOrchestrator,
		@inject(TOKENS.DiscordButtonsOrchestrator)
		private readonly buttonsOrchestrator: DiscordButtonsOrchestrator,
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

		await this.commandsOrchestrator.registerCommands();

		this.discordClient.onInteraction(async (interaction: Interaction) => {
			this.logger.info(
				`[Discord] Received interaction of type ${interaction.type}`,
			);

			if (
				!interaction.guildId ||
				interaction.guildId !== env.DISCORD_GUILD_ID
			) {
				this.logger.warn(
					`[Discord] Interaction received from unsupported guild: ${interaction.guildId}`,
				);
				return;
			}

			try {
				if (interaction.isChatInputCommand()) {
					return await this.commandsOrchestrator.handle(interaction);
				}

				if (interaction.isButton()) {
					return await this.buttonsOrchestrator.handle(interaction);
				}
			} catch (error) {
				this.logger.error(
					`[Discord] Error handling interaction of type ${interaction.type}`,
					{ error },
				);
				const code = getDiscordErrorCode(error);

				// Em HMR/dev é comum dar 10062/40060, não adianta tentar responder
				if (code === 10062 || code === 40060) {
					return;
				}

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
					this.logger.error("[Discord] Failed to send error reply", {
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
