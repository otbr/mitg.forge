import { container, Lifecycle } from "tsyringe";
import { DiscordClient } from "@/domain/clients";
import {
	DiscordAccountShowButtonHandler,
	DiscordBot,
	DiscordButtonsOrchestrator,
	DiscordCommandsOrchestrator,
	DiscordPingCommand,
} from "@/domain/discord";
import { DiscordAccountCommand } from "@/domain/discord/commands/account";
import { env } from "@/infra/env";
import { TOKENS } from "../tokens";

export const registerDiscord = () => {
	container.register(
		TOKENS.DiscordClient,
		{ useClass: DiscordClient },
		{ lifecycle: Lifecycle.Singleton },
	);

	container.register(
		TOKENS.DiscordBot,
		{ useClass: DiscordBot },
		{ lifecycle: env.isDev ? Lifecycle.ResolutionScoped : Lifecycle.Singleton },
	);

	container.register(
		TOKENS.DiscordCommandsOrchestrator,
		{ useClass: DiscordCommandsOrchestrator },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.DiscordButtonsOrchestrator,
		{ useClass: DiscordButtonsOrchestrator },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.DiscordPingCommand,
		{ useToken: DiscordPingCommand },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.DiscordAccountCommand,
		{ useToken: DiscordAccountCommand },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.DiscordAccountShowButtonHandler,
		{ useClass: DiscordAccountShowButtonHandler },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
};
