import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import { injectable } from "tsyringe";
import { BUTTON_ID_PREFIX, makeButtonId } from "../../buttons";
import { DiscordSlashCommandBase } from "../base";

@injectable()
export class DiscordAccountCommand extends DiscordSlashCommandBase {
	commandName = "account";
	public readonly data = new SlashCommandBuilder()
		.setName("account")
		.setDescription("Mostra ações para uma conta pelo email")
		.addStringOption((option) =>
			option
				.setName("email")
				.setDescription("Email da conta")
				.setRequired(true),
		);

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const email = interaction.options.getString("email", true);

		const customId = makeButtonId(BUTTON_ID_PREFIX.ACCOUNT_SHOW, {
			email: email,
		});

		const button = new ButtonBuilder()
			.setCustomId(customId)
			.setLabel("Mostrar Conta")
			.setStyle(ButtonStyle.Primary);

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

		await interaction.reply({
			content: `Ações para a conta com email: **${email}**`,
			components: [row],
			flags: MessageFlags.Ephemeral,
		});
	}
}
