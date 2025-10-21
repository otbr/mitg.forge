import { config as dotenv } from "dotenv-flow";
import { env } from "@/env";
import { app } from "@/main/config/app";

dotenv({
	node_env: process.env.NODE_ENV || "development",
	debug: true,
});

if (import.meta.main) {
	const server = Bun.serve({
		fetch: app.fetch,
		port: env.PORT,
	});

	const shutdown = async (signal: string) => {
		console.info(`Received ${signal}, shutting down server...`);
		server.stop(true);

		await Bun.sleep(500);
		process.exit();
	};

	process.on("SIGINT", () => shutdown("SIGINT"));
	process.on("SIGTERM", () => shutdown("SIGTERM"));
}
