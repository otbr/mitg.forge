import type { Interaction } from "discord.js";
import { injectable } from "tsyringe";
import type { DiscordMiddleware } from "@/discord/middlewares/base";
import { DiscordError, DiscordErrorCode } from "@/discord/utils/error";
import type { ExecutionContext } from "@/domain/context";

@injectable()
export class DiscordRequireLinkedAccountMiddleware
	implements DiscordMiddleware
{
	async handle(
		interaction: Interaction,
		ctx: ExecutionContext,
		next: () => Promise<void>,
	): Promise<void> {
		const session = ctx.sessionOrNull();

		if (!session) {
			throw new DiscordError(DiscordErrorCode.MissingLinkedAccount, {
				message: `No linked account found for Discord user ID: ${interaction.user.id}`,
				userMessage: "Você precisa vincular sua conta para usar este comando.",
			});
		}

		return next();
	}
}
