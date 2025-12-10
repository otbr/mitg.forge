import { container } from "tsyringe";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";

export const bootstrapDiscord = () => {
	const logger = container.resolve(TOKENS.Logger);

	if (!env.DISCORD_ENABLED) {
		logger.info("[Discord] integration is disabled.");
		return;
	}

	const discordBot = container.resolve(TOKENS.DiscordBot);

	discordBot
		.start()
		.then(() => {
			logger.info("[Discord]: Discord bot started successfully");
		})
		.catch((err) => {
			logger.error("[Discord]: Error starting Discord bot", {
				error: String(err),
			});
			console.error(err);
		});

	const shutdown = async (signal: string) => {
		logger.info(`[Discord]: Received ${signal}, shutting down Discord bot...`);

		try {
			await discordBot.stop();
			logger.info("[Discord]: Bot stopped.");
		} catch (error) {
			logger.error("[Discord]: Error stopping Discord bot", { error });
		}

		process.exit(0);
	};

	process.on("SIGINT", () => shutdown("SIGINT"));
	process.on("SIGTERM", () => shutdown("SIGTERM"));

	// 🧪 HMR em dev, igual jobs
	if (env.isDev && import.meta.hot) {
		import.meta.hot.accept();
		import.meta.hot.dispose(async () => {
			try {
				await discordBot.stop();
				logger.info("[Discord]:HMR: Bot stopped");
			} catch (error) {
				logger.error("[Discord]:HMR: Error stopping Discord bot", {
					error,
				});
			}
		});
	}
};
