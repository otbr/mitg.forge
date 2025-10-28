import type { DependencyContainer } from "tsyringe";
import { TOKENS } from "@/di/tokens";
import type { ClientService } from "@/domain";
import type { Logger } from "@/infra/logging/logger";

export class Services {
	constructor(private readonly di: DependencyContainer) {}

	get client() {
		return this.di.resolve<ClientService>(TOKENS.ClientService);
	}

	get logger() {
		return this.di.resolve<Logger>(TOKENS.Logger);
	}
}
