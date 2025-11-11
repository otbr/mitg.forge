import { renderTemplate } from "@miforge/email";
import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import type { Mailer } from "@/domain/modules/clients";
import type { Metadata } from "@/domain/modules/metadata";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountDetailsContractInput,
	AccountDetailsContractOutput,
} from "./contract";

@injectable()
export class AccountDetailsBySessionUseCase
	implements UseCase<AccountDetailsContractInput, AccountDetailsContractOutput>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
		@inject(TOKENS.Metadata) private readonly metadata: Metadata,
		@inject(TOKENS.Mailer) private readonly mailer: Mailer,
	) {}

	async execute(): Promise<AccountDetailsContractOutput> {
		const session = this.metadata.session();

		const html = await renderTemplate("RecoveryKey", {
			code: "SOME-RECOVERY-KEY",
			user: session.email,
		});

		this.mailer.sendMail({
			to: "gui.fontes.amorim@gmail.com",
			subject: "Your account details were accessed",
			html,
		});

		return this.accountsService.details(session.email);
	}
}
