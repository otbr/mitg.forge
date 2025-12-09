import { inject, injectable } from "tsyringe";
import type { AccountOauthService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountDiscordOauthConfirmLinkContractInput,
	AccountDiscordOauthConfirmLinkContractOutput,
} from "./contract";

@injectable()
export class AccountDiscordOauthConfirmLinkUseCase
	implements
		UseCase<
			AccountDiscordOauthConfirmLinkContractInput,
			AccountDiscordOauthConfirmLinkContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountOauthService)
		private readonly accountOauthService: AccountOauthService,
	) {}

	async execute(
		input: AccountDiscordOauthConfirmLinkContractInput,
	): Promise<AccountDiscordOauthConfirmLinkContractOutput> {
		const { url } = await this.accountOauthService.confirmDiscordLink(
			input.code,
			input.state,
		);

		return {
			status: 302,
			headers: {
				Location: url,
			},
			body: null,
		};
	}
}
