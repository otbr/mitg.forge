import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ChatInputCommandInteraction,
	EmbedBuilder,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import { inject, injectable } from "tsyringe";

import {
	DiscordSlashCommandBase,
	type SubCommandHandler,
} from "@/discord/commands/base";
import type { ExecutionContext } from "@/domain/context";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";

@injectable()
export class DiscordAccountCommands extends DiscordSlashCommandBase {
	data = new SlashCommandBuilder()
		.setName("account")
		.setDescription("Gerencia a sua conta MiForge.")
		.addSubcommand((sub) =>
			sub.setName("status").setDescription("Mostra o status do vínculo."),
		)
		.addSubcommand((sub) =>
			sub.setName("link").setDescription("Mostra como vincular sua conta."),
		);

	private readonly subCommands: Record<string, SubCommandHandler>;

	constructor(
		@inject(TOKENS.ExecutionContext) private readonly ctx: ExecutionContext,
	) {
		super();

		this.subCommands = {
			status: this.handleStatus.bind(this),
			link: this.handleLink.bind(this),
		};
	}

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const subcommand = interaction.options.getSubcommand();
		const handler = this.subCommands[subcommand];

		if (!handler) {
			await interaction.reply({
				content: "Subcomando desconhecido.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		return handler(interaction);
	}

	private async handleStatus(
		interaction: ChatInputCommandInteraction,
	): Promise<void> {
		const session = this.ctx.sessionOrNull();

		if (!session) {
			const { embed, row } = this.embedLinkInstructions();

			await interaction.reply({
				embeds: [embed],
				components: [row],
				flags: MessageFlags.Ephemeral,
			});

			return;
		}

		const embed = new EmbedBuilder()
			.setTitle("🔗 Status da sua conta")
			.setDescription("✅ Sua conta MiForge está vinculada ao seu Discord.")
			.addFields(
				{ name: "📧 E-mail", value: `\`${session.email}\``, inline: true },
				{ name: "👤 Tipo", value: `\`${session.type}\``, inline: true },
			);

		await interaction.reply({
			embeds: [embed],
			flags: MessageFlags.Ephemeral,
		});
	}

	private async handleLink(
		interaction: ChatInputCommandInteraction,
	): Promise<void> {
		const { embed, row } = this.embedLinkInstructions();

		await interaction.reply({
			embeds: [embed],
			components: [row],
			flags: MessageFlags.Ephemeral,
		});
	}

	private embedLinkInstructions() {
		const url = `${env.FRONTEND_URL}/account/details`;

		const embed = new EmbedBuilder()
			.setTitle("🔗 Vincular conta MiForge")
			.setDescription(
				[
					"Para vincular sua conta MiForge ao Discord:",
					"1. Clique no botão abaixo para abrir o painel de vínculo.",
					"2. Faça login com sua conta MiForge.",
					"3. Siga as instruções na tela para completar o vínculo.",
					"Após vincular, você poderá usar comandos exclusivos relacionados à sua conta MiForge diretamente no Discord!",
				].join("\n"),
			);

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel("Abrir painel de vínculo")
				.setStyle(ButtonStyle.Link)
				.setURL(url),
		);

		return {
			embed,
			row,
		};
	}
}
