import type { Interaction } from "discord.js";
import { inject, injectable } from "tsyringe";
import type { DiscordMiddleware } from "@/discord/middlewares/base";
import type { ExecutionContext } from "@/domain/context";
import type { AccountRepository } from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import { getAccountType } from "@/shared/utils/account/type";

@injectable()
export class DiscordSessionMiddleware implements DiscordMiddleware {
	constructor(
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
	) {}

	async handle(
		interaction: Interaction,
		ctx: ExecutionContext,
		next: () => Promise<void>,
	): Promise<void> {
		const discordUserId = interaction.user.id;

		const account = await this.accountRepository.findAccountByProviderId(
			"DISCORD",
			discordUserId,
		);

		if (account) {
			ctx.setSession({
				email: account.email,
				id: account.id,
				token: "",
				type: getAccountType(account.type),
			});
		}

		return next();
	}
}
