import type { Interaction } from "discord.js";
import { container, type DependencyContainer } from "tsyringe";
import {
	DiscordExecutionContext,
	type ExecutionContext,
} from "@/domain/context";
import { makeExecutionLogger, type RootLogger } from "@/domain/modules";
import { TOKENS } from "./tokens";

export function createDiscordContainer(interaction: Interaction): {
	scope: DependencyContainer;
	ctx: ExecutionContext;
} {
	const childContainer = container.createChildContainer();

	childContainer.register<Interaction>(TOKENS.DiscordInteraction, {
		useValue: interaction,
	});

	const execContext: ExecutionContext = new DiscordExecutionContext();
	childContainer.registerInstance(TOKENS.ExecutionContext, execContext);

	const rootLogger = childContainer.resolve<RootLogger>(TOKENS.RootLogger);

	childContainer.registerInstance(
		TOKENS.Logger,
		makeExecutionLogger(rootLogger, execContext),
	);

	return {
		scope: childContainer,
		ctx: execContext,
	};
}
