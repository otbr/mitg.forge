import { AccountDiscordOauthUnlinkContractSchema } from "@/application/usecases/account/discordUnlink/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const discordOauthUnlinkRoute = isAuthenticatedProcedure
	.route({
		method: "DELETE",
		path: "/",
		summary: "OAuth Discord Link",
		successStatus: 202,
		description: "Get the OAuth link to authenticate with Discord.",
	})
	.input(AccountDiscordOauthUnlinkContractSchema.input)
	.output(AccountDiscordOauthUnlinkContractSchema.output)
	.handler(async ({ context }) => {
		return context.usecases.account.discordOauthUnlink.execute();
	});
