import {
	type ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import { DiscordSlashCommandBase } from "@/domain/discord/commands/base";

export class DiscordPingCommand extends DiscordSlashCommandBase {
	data = new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!");
	commandName = "ping";

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.reply({
			content: "Pong!",
			flags: MessageFlags.Ephemeral,
		});
	}
}
