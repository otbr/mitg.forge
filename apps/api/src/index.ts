import "reflect-metadata";
import { config as dotenv } from "dotenv-flow";
import { container } from "tsyringe";
import { env } from "@/env";
import { app } from "@/main/config/app";
import { TOKENS } from "./di/tokens";
import type { Logger } from "./infra/logging/logger";

dotenv({
	node_env: process.env.NODE_ENV || "development",
	debug: true,
});

const logger = container.resolve<Logger>(TOKENS.RootLogger);

if (import.meta.main) {
	const server = Bun.serve({
		fetch: app.fetch,
		port: env.PORT,
	});
	logger.info(`Server running on port ${env.PORT}`);

	const shutdown = async (signal: string) => {
		logger.info(`Received ${signal}, shutting down server...`);
		server.stop(true);

		await Bun.sleep(500);
		process.exit();
	};

	process.on("SIGINT", () => shutdown("SIGINT"));
	process.on("SIGTERM", () => shutdown("SIGTERM"));
}
