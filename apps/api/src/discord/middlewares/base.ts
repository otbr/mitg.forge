import type { Interaction } from "discord.js";
import type { DiscordButtonHandler } from "@/discord/buttons/base";
import type { DiscordSlashCommand } from "@/discord/commands";
import type { ExecutionContext } from "@/domain/context";

export interface DiscordMiddleware {
	handle(
		interaction: Interaction,
		ctx: ExecutionContext,
		next: () => Promise<void>,
		handler?: DiscordSlashCommand | DiscordButtonHandler,
	): Promise<void>;
}
