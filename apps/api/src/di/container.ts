import { container, type DependencyContainer, Lifecycle } from "tsyringe";
import { ClientService } from "@/domain";
import { env } from "@/env";
import { makePrisma, type Prisma } from "@/infra/clients";
import { RootLogger } from "@/infra/logging/logger";
import { makeRequestLogger } from "@/infra/logging/request-logger";
import { TOKENS } from "./tokens";

declare global {
	var __PRISMA__: Prisma | undefined;
}

const root = new RootLogger({
	level: env.LOG_LEVEL,
	base: { service: env.SERVICE_NAME },
});

const prismaSingleton: Prisma = global.__PRISMA__ ?? makePrisma(root);

if (env.isDev) {
	global.__PRISMA__ = prismaSingleton;
}

container.registerInstance(TOKENS.Prisma, prismaSingleton);

// Root Global
container.registerInstance(TOKENS.RootLogger, root);

export function createRequestContainer(
	context: ReqContext,
): DependencyContainer {
	const di = container.createChildContainer();

	di.register<ReqContext>(TOKENS.ReqContext, { useValue: context });

	// Logger (scoped per request)
	const rootLogger = di.resolve<RootLogger>(TOKENS.RootLogger);
	di.registerInstance(TOKENS.Logger, makeRequestLogger(rootLogger, context));

	// Services
	di.register(
		TOKENS.ClientService,
		{ useClass: ClientService },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	return di;
}
