import { AccountDiscordOauthConfirmLinkContractSchema } from "@/application/usecases/account/discordOauthConfirmLink/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const discordOauthConfirmLinkRoute = isAuthenticatedProcedure
	.route({
		method: "GET",
		path: "/callback",
		summary: "OAuth Discord Confirm Link",
		successStatus: 302,
		description: "Get the OAuth confirm link to authenticate with Discord.",
		outputStructure: "detailed",
	})
	.input(AccountDiscordOauthConfirmLinkContractSchema.input)
	.output(AccountDiscordOauthConfirmLinkContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.discordOauthConfirmLink.execute(input);
	});
