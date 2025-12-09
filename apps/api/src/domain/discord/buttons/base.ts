import type { ButtonInteraction } from "discord.js";
import type z from "zod";
import type { ButtonIdPrefix } from "./custom-ids";

export abstract class DiscordButtonHandlerBase<TPayload> {
	abstract prefix: ButtonIdPrefix;
	abstract schema: z.ZodType<TPayload>;

	abstract handle(
		interaction: ButtonInteraction,
		payload: TPayload,
	): Promise<void>;
}

export type DiscordButtonHandler<TPayload = unknown> =
	DiscordButtonHandlerBase<TPayload>;
