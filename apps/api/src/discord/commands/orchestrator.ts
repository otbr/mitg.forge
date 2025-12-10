import type { ChatInputCommandInteraction, Interaction } from "discord.js";
import { type DependencyContainer, inject, injectable } from "tsyringe";
import type { DiscordSlashCommand } from "@/discord/commands/base";
import type { DiscordMiddleware } from "@/discord/middlewares/base";
import type { DiscordClient } from "@/domain/clients";
import type { ExecutionContext } from "@/domain/context";
import type { Logger } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";

const COMMAND_TOKENS = [
	TOKENS.DiscordPingCommand,
	TOKENS.DiscordAccountCommands,
] as const;

const GLOBAL_MIDDLEWARE_TOKENS = [] as const;

@injectable()
export class DiscordCommandsOrchestrator {
	constructor(
		@inject(TOKENS.Logger) private readonly logger: Logger,
		@inject(TOKENS.DiscordClient) private readonly discordClient: DiscordClient,
	) {}

	private buildCommandsMap(scope: DependencyContainer) {
		const entries = COMMAND_TOKENS.map((token) => {
			const cmd = scope.resolve<DiscordSlashCommand>(token);
			return [cmd.data.name, cmd] as const;
		});

		return new Map<string, DiscordSlashCommand>(entries);
	}

	async registerCommands(scope: DependencyContainer): Promise<void> {
		const commandsMap = this.buildCommandsMap(scope);
		const commands = Array.from(commandsMap.values());

		await this.discordClient.registerCommands(
			commands.map((cmd) => cmd.data.toJSON()),
		);
	}

	async handle(
		interaction: Interaction,
		scope: DependencyContainer,
	): Promise<void> {
		if (!interaction.isChatInputCommand()) {
			this.logger.warn(
				`[DiscordCommandsOrchestrator] Unsupported interaction type: ${interaction.type}`,
			);
			return;
		}

		const chatInputInteraction = interaction as ChatInputCommandInteraction;

		const ctx = scope.resolve<ExecutionContext>(TOKENS.ExecutionContext);
		const commandsMap = this.buildCommandsMap(scope);

		const command = commandsMap.get(chatInputInteraction.commandName);

		if (!command) {
			this.logger.error(
				`[DiscordCommandsOrchestrator] No command found for name: ${chatInputInteraction.commandName}`,
			);
			return;
		}

		const globalMiddlewares = GLOBAL_MIDDLEWARE_TOKENS.map((token) =>
			scope.resolve<DiscordMiddleware>(token),
		);

		const commandMiddlewares = command.middlewares.map((token) =>
			scope.resolve<DiscordMiddleware>(token),
		);

		const allMiddlewares = [...globalMiddlewares, ...commandMiddlewares];

		const runner = allMiddlewares.reverse().reduce<() => Promise<void>>(
			(next, mw) => () => mw.handle(chatInputInteraction, ctx, next, command),
			() => command.execute(chatInputInteraction, ctx),
		);

		await runner();
	}
}
