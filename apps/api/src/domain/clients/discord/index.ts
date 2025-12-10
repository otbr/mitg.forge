import {
	Client,
	Events,
	GatewayIntentBits,
	type Interaction,
	type MessageCreateOptions,
	type MessagePayload,
	REST,
	Routes,
	type TextChannel,
} from "discord.js";
import { inject, injectable } from "tsyringe";
import type { Logger } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";

@injectable()
export class DiscordClient {
	private client: Client;
	private rest: REST;
	private readyPromise: Promise<void> | null = null;
	private started = false;
	private interactionHandlers: Array<(i: Interaction) => void> = [];

	constructor(@inject(TOKENS.Logger) private readonly logger: Logger) {
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
			],
		});

		this.rest = new REST({ version: "10" });

		if (env.DISCORD_TOKEN) {
			this.rest.setToken(env.DISCORD_TOKEN);
		} else {
			logger.error("DISCORD_TOKEN is not set in environment variables.");
		}
	}

	start() {
		if (!env.DISCORD_ENABLED) {
			this.logger.warn("[Discord] integration is disabled.");
			return Promise.resolve();
		}

		if (this.readyPromise) {
			return this.readyPromise;
		}

		this.readyPromise = new Promise<void>((resolve, reject) => {
			this.client.once(Events.ClientReady, () => {
				this.started = true;
				this.logger.info("[Discord] Bot Connected", {
					tag: this.client.user?.tag,
				});
				resolve();
			});

			this.client.login(env.DISCORD_TOKEN).catch((error) => {
				this.logger.error("[Discord] Error connecting the bot", {
					error: error.message || error.toString(),
				});
				reject(error);
			});
		});

		return this.readyPromise;
	}

	async stop() {
		if (!this.started) return;

		this.logger.info("[Discord] Disconnecting Discord bot...");

		for (const handler of this.interactionHandlers) {
			this.client.off(Events.InteractionCreate, handler);
		}

		this.interactionHandlers = [];

		this.client.removeAllListeners();
		this.client.destroy();

		this.started = false;
		this.readyPromise = null;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <any commands can be registered>
	async registerCommands(commands: any[]) {
		if (!env.DISCORD_ENABLED) {
			this.logger.warn(
				"[Discord] integration is disabled. Skipping command registration.",
			);
			return Promise.resolve();
		}

		await this.start();

		try {
			await this.rest.put(
				Routes.applicationGuildCommands(
					// biome-ignore lint/style/noNonNullAssertion: <if reach this point, the value is defined>
					env.DISCORD_CLIENT_ID!,
					// biome-ignore lint/style/noNonNullAssertion: <if reach this point, the value is defined>
					env.DISCORD_GUILD_ID!,
				),
				{
					body: commands,
				},
			);

			this.logger.info("[Discord] Guild commands registered", {
				guildId: env.DISCORD_GUILD_ID,
				commands: commands.map((command) => command?.name),
			});
		} catch (error) {
			this.logger.error("[Discord] Error registering commands", { error });
		}
	}

	onInteraction(handler: (interaction: Interaction) => void) {
		this.client.on(Events.InteractionCreate, handler);
		this.interactionHandlers.push(handler);
	}

	async sendPrivateMessage(
		userId: string,
		content: string | MessagePayload | MessageCreateOptions,
	) {
		if (!env.DISCORD_ENABLED) {
			this.logger.warn(
				"[Discord] integration is disabled. Skipping sending message.",
			);
			return;
		}

		await this.start();

		const user = await this.client.users.fetch(userId);

		if (!user) {
			this.logger.error(`[Discord] User with ID ${userId} not found.`);
			return;
		}

		await user.send(typeof content === "string" ? { content } : content);
	}

	async sendToChannel(
		channelId: string,
		content: string | MessagePayload | MessageCreateOptions,
	) {
		if (!env.DISCORD_ENABLED) {
			this.logger.warn(
				"[Discord] integration is disabled. Skipping sending message.",
			);
			return;
		}

		await this.start();

		const channel = await this.client.channels.fetch(channelId);

		if (!channel || !channel.isTextBased()) {
			this.logger.error(
				`[Discord] Channel with ID ${channelId} not found or is not text-based.`,
			);
			return;
		}

		const textChannel = channel as TextChannel;
		await textChannel.send(typeof content === "string" ? { content } : content);
	}
}
