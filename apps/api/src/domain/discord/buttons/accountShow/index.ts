import { type ButtonInteraction, MessageFlags } from "discord.js";
import { inject, injectable } from "tsyringe";
import z from "zod";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";
import { DiscordButtonHandlerBase } from "../base";
import { BUTTON_ID_PREFIX } from "../custom-ids";

const AccountShowPayloadSchema = z.object({
	email: z.email(),
});

type AccountShowPayload = z.infer<typeof AccountShowPayloadSchema>;

@injectable()
export class DiscordAccountShowButtonHandler extends DiscordButtonHandlerBase<AccountShowPayload> {
	prefix = BUTTON_ID_PREFIX.ACCOUNT_SHOW;
	schema = AccountShowPayloadSchema;

	constructor(@inject(TOKENS.Prisma) private readonly database: Prisma) {
		super();
	}

	async handle(
		interaction: ButtonInteraction,
		payload: AccountShowPayload,
	): Promise<void> {
		const account = await this.database.accounts.findUnique({
			where: { email: payload.email },
		});

		if (!account) {
			await interaction.reply({
				content: `Nenhuma conta encontrada para \`${payload.email}\`.`,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await interaction.reply({
			content: [
				"✅ Conta de encontrada",
				`Email: \`${payload.email}\``,
				`Criada em: \`${account.created_at.toISOString()}\``,
			].join("\n"),
			flags: MessageFlags.Ephemeral,
		});
	}
}
