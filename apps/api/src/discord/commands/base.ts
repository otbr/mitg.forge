import type {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import type { InjectionToken } from "tsyringe";
import type { ExecutionContext } from "@/domain/context";
import type { AccountType } from "@/shared/utils/account/type";

export abstract class DiscordSlashCommandBase {
	abstract data:
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| SlashCommandOptionsOnlyBuilder;
	permission: AccountType | null = null;

	/**
	 * Middlewares específicos desse comando
	 * (TOKENS de middlewares)
	 */
	public readonly middlewares: InjectionToken[] = [];

	abstract execute(
		interaction: ChatInputCommandInteraction,
		ctx: ExecutionContext,
	): Promise<void>;
}

export type DiscordSlashCommand = DiscordSlashCommandBase;

export type SubCommandHandler = (
	interaction: ChatInputCommandInteraction,
) => Promise<void>;
