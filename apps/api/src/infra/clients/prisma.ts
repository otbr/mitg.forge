import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "generated/client";
import { env } from "@/env";
import type { Logger } from "@/infra/logging/logger";

export type Prisma = PrismaClient;

export function makePrisma(rootLogger?: Logger) {
	const adapter = new PrismaMariaDb({
		host: env.DATABASE_HOST,
		user: env.DATABASE_USER,
		password: env.DATABASE_PASSWORD,
		database: env.DATABASE_NAME,
	});
	const prisma = new PrismaClient({
		adapter,
		log: [
			{ level: "query", emit: "event" },
			{ level: "error", emit: "event" },
			{ level: "warn", emit: "event" },
		],
	});

	if (rootLogger) {
		prisma.$on("query", (event) => {
			rootLogger.debug("prisma.query", event);
		});
		prisma.$on("warn", (event) => rootLogger.warn("prisma.warn", event));
		prisma.$on("error", (event) => rootLogger.error("prisma.error", event));
	}

	process.on("beforeExit", async () => {
		await prisma.$disconnect().catch(() => {});
	});

	return prisma;
}
