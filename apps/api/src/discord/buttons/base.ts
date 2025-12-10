import type { ButtonInteraction } from "discord.js";
import type { InjectionToken } from "tsyringe";
import type z from "zod";
import type { ButtonIdPrefix } from "@/discord/buttons/custom-ids";
import type { ExecutionContext } from "@/domain/context";
import type { AccountType } from "@/shared/utils/account/type";

export abstract class DiscordButtonHandlerBase<TPayload> {
	abstract prefix: ButtonIdPrefix;
	abstract schema: z.ZodType<TPayload>;
	permission: AccountType | null = null;

	/**
	 * Middlewares específicos desse comando
	 * (TOKENS de middlewares)
	 */
	public readonly middlewares: InjectionToken[] = [];

	abstract handle(
		interaction: ButtonInteraction,
		payload: TPayload,
		ctx: ExecutionContext,
	): Promise<void>;
}

export type DiscordButtonHandler<TPayload = unknown> =
	DiscordButtonHandlerBase<TPayload>;
