import z from "zod";

export const AccountDiscordOauthConfirmLinkContractSchema = {
	input: z.object({
		state: z.string(),
		code: z.string(),
	}),
	output: z.object({
		status: z.literal(302),
		headers: z.object({
			Location: z.url(),
		}),
		body: z.null(),
	}),
};

export type AccountDiscordOauthConfirmLinkContractInput = z.infer<
	typeof AccountDiscordOauthConfirmLinkContractSchema.input
>;

export type AccountDiscordOauthConfirmLinkContractOutput = z.infer<
	typeof AccountDiscordOauthConfirmLinkContractSchema.output
>;
