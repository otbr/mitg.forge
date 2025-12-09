import z from "zod";

export const AccountDiscordOauthLinkContractSchema = {
	input: z.unknown(),
	output: z.object({
		status: z.literal(302),
		headers: z.object({
			Location: z.url(),
		}),
		body: z.null(),
	}),
};

export type AccountDiscordOauthLinkContractInput = z.infer<
	typeof AccountDiscordOauthLinkContractSchema.input
>;

export type AccountDiscordOauthLinkContractOutput = z.infer<
	typeof AccountDiscordOauthLinkContractSchema.output
>;
