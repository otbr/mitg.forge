import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/di/tokens";
import type { Prisma } from "@/infra/clients";
import type { Logger } from "@/infra/logging/logger";

@injectable()
export class ClientService {
	constructor(
		@inject(TOKENS.ReqContext) private readonly ctx: ReqContext,
		@inject(TOKENS.Logger) private readonly logger: Logger,
		@inject(TOKENS.Prisma) private readonly prisma: Prisma,
	) {}

	async handle(value: number) {
		this.logger.info(`[test] handling value ${value}`, {
			userId: "user-123",
		});

		const configs = await this.prisma.server_config.findMany();

		this.logger.info(`[test] fetched ${configs.length} configs`, {
			configs,
		});

		return value % 2 === 0;
	}
}
