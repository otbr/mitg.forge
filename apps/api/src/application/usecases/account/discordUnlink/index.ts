import { inject, injectable } from "tsyringe";
import type { AccountOauthService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountDiscordOauthUnlinkContractInput,
	AccountDiscordOauthUnlinkContractOutput,
} from "./contract";

@injectable()
export class AccountDiscordOauthUnlinkUseCase
	implements
		UseCase<
			AccountDiscordOauthUnlinkContractInput,
			AccountDiscordOauthUnlinkContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountOauthService)
		private readonly accountOauthService: AccountOauthService,
	) {}

	async execute(): Promise<AccountDiscordOauthUnlinkContractOutput> {
		return this.accountOauthService.unlinkDiscord();
	}
}
