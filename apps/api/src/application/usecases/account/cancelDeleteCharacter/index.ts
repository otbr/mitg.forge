import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountCancelDeleteCharacterContractInput,
	AccountCancelDeleteCharacterContractOutput,
} from "./contract";

@injectable()
export class AccountCancelDeleteCharacterUseCase
	implements
		UseCase<
			AccountCancelDeleteCharacterContractInput,
			AccountCancelDeleteCharacterContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
	) {}

	async execute(
		input: AccountCancelDeleteCharacterContractInput,
	): Promise<AccountCancelDeleteCharacterContractOutput> {
		await this.accountsService.cancelCharacterDeletionByName(input.name);
	}
}
