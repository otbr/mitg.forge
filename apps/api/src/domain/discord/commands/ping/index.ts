import {
	type ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import { injectable } from "tsyringe";
import { DiscordSlashCommandBase } from "@/domain/discord/commands/base";

@injectable()
export class DiscordPingCommand extends DiscordSlashCommandBase {
	data = new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!");
	commandName = "ping";

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const latency = Date.now() - interaction.createdTimestamp;

		await interaction.reply({
			content: `Pong! 🏓 Latency: ${latency}ms`,
			flags: MessageFlags.Ephemeral,
		});
	}
}
