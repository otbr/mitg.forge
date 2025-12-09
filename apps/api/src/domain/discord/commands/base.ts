import type {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export abstract class DiscordSlashCommandBase {
	abstract data:
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| SlashCommandOptionsOnlyBuilder;
	abstract commandName: string;

	abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export type DiscordSlashCommand = DiscordSlashCommandBase;
