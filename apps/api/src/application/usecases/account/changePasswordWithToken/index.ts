import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	ChangePasswordWithTokenContractInput,
	ChangePasswordWithTokenContractOutput,
} from "./contract";

@injectable()
export class ChangePasswordWithTokenUseCase
	implements
		UseCase<
			ChangePasswordWithTokenContractInput,
			ChangePasswordWithTokenContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
	) {}

	execute(
		input: ChangePasswordWithTokenContractInput,
	): Promise<ChangePasswordWithTokenContractOutput> {
		return this.accountsService.changePasswordWithToken({
			newPassword: input.newPassword,
			token: input.token,
		});
	}
}
