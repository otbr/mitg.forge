import type { ChatInputCommandInteraction, Interaction } from "discord.js";
import { inject, injectable } from "tsyringe";
import type { DiscordClient } from "@/domain/clients";
import type { Logger } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import type { DiscordSlashCommand } from "./base";

@injectable()
export class DiscordCommandsOrchestrator {
	private readonly commands: Map<string, DiscordSlashCommand>;

	constructor(
		@inject(TOKENS.Logger) private readonly logger: Logger,
		@inject(TOKENS.DiscordClient) private readonly discordClient: DiscordClient,
		@inject(TOKENS.DiscordPingCommand) pingCommand: DiscordSlashCommand,
		@inject(TOKENS.DiscordAccountCommand) accountCommand: DiscordSlashCommand,
	) {
		this.commands = new Map<string, DiscordSlashCommand>([
			[pingCommand.commandName, pingCommand],
			[accountCommand.commandName, accountCommand],
		]);
	}

	async registerCommands(): Promise<void> {
		const commandsArray = Array.from(this.commands.values()).map(
			(command) => command,
		);

		await this.discordClient.registerCommands(
			commandsArray.map((cmd) => cmd.data.toJSON()),
		);
	}

	async handle(interaction: Interaction): Promise<void> {
		if (!interaction.isChatInputCommand()) {
			this.logger.warn(
				`[DiscordCommandsOrchestrator] Unsupported interaction type: ${interaction.type}`,
			);
			return;
		}

		const chatInputInteraction = interaction as ChatInputCommandInteraction;

		const command = this.commands.get(chatInputInteraction.commandName);

		if (!command) {
			this.logger.error(
				`[DiscordCommandsOrchestrator] No command found for name: ${chatInputInteraction.commandName}`,
			);
			return;
		}

		await command.execute(chatInputInteraction);
	}
}
