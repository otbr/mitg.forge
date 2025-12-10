import z from "zod";

export const AccountDiscordOauthUnlinkContractSchema = {
	input: z.unknown(),
	output: z.void(),
};

export type AccountDiscordOauthUnlinkContractInput = z.infer<
	typeof AccountDiscordOauthUnlinkContractSchema.input
>;

export type AccountDiscordOauthUnlinkContractOutput = z.infer<
	typeof AccountDiscordOauthUnlinkContractSchema.output
>;
