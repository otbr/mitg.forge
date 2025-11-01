import type { DependencyContainer } from "tsyringe";
import { TOKENS } from "@/di/tokens";

import type { Logger } from "@/infra/logging/logger";
import { AccountsService } from "./accounts";
import { SessionService } from "./session";
import { TibiaClientService } from "./tibiaclient";

export class Services {
	constructor(private readonly di: DependencyContainer) {}

	get tibiaClient() {
		return this.di.resolve<TibiaClientService>(TOKENS.TibiaClientService);
	}

	get accounts() {
		return this.di.resolve<AccountsService>(TOKENS.AccountsService);
	}

	get session() {
		return this.di.resolve<SessionService>(TOKENS.SessionService);
	}

	get logger() {
		return this.di.resolve<Logger>(TOKENS.Logger);
	}
}

export { AccountsService, SessionService, TibiaClientService };
