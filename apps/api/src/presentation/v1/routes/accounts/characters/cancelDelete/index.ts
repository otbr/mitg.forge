import { AccountCancelDeleteCharacterContractSchema } from "@/application/usecases/account/cancelDeleteCharacter/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const cancelDeleteCharacterRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/character/{name}/cancel",
		summary: "Cancel delete character",
		successStatus: 204,
		description:
			"Cancel the deletion of a character by name associated with the authenticated user's account.",
	})
	.input(AccountCancelDeleteCharacterContractSchema.input)
	.output(AccountCancelDeleteCharacterContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.cancelDeleteCharacter.execute(input);
	});
