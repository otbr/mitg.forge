import { AccountDiscordOauthLinkContractSchema } from "@/application/usecases/account/discordOauthLink/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const discordOauthLinkRoute = isAuthenticatedProcedure
	.route({
		method: "GET",
		path: "/",
		summary: "OAuth Discord Link",
		successStatus: 302,
		description: "Get the OAuth link to authenticate with Discord.",
		outputStructure: "detailed",
	})
	.input(AccountDiscordOauthLinkContractSchema.input)
	.output(AccountDiscordOauthLinkContractSchema.output)
	.handler(async ({ context }) => {
		return context.usecases.account.discordOauthLink.execute({});
	});
