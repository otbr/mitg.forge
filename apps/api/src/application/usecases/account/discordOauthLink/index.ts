import { inject, injectable } from "tsyringe";
import type { AccountOauthService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountDiscordOauthLinkContractInput,
	AccountDiscordOauthLinkContractOutput,
} from "./contract";

@injectable()
export class AccountDiscordOauthLinkUseCase
	implements
		UseCase<
			AccountDiscordOauthLinkContractInput,
			AccountDiscordOauthLinkContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountOauthService)
		private readonly accountOauthService: AccountOauthService,
	) {}

	async execute(
		_input: AccountDiscordOauthLinkContractInput,
	): Promise<AccountDiscordOauthLinkContractOutput> {
		const { url } = await this.accountOauthService.requestDiscordLink();

		return {
			status: 302,
			headers: {
				Location: url,
			},
			body: null,
		};
	}
}
