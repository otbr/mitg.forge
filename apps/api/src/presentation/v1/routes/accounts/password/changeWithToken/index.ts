import { ChangePasswordWithTokenContractSchema } from "@/application/usecases/account/changePasswordWithToken/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const changePasswordWithTokenRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/change-with-token",
		summary: "Change Password With Token",
		successStatus: 204,
		description: "Change a user's password by providing a token.",
	})
	.input(ChangePasswordWithTokenContractSchema.input)
	.output(ChangePasswordWithTokenContractSchema.output)
	.handler(async ({ context, input }) => {
		await context.usecases.account.changePasswordWithToken.execute({
			confirmPassword: input.confirmPassword,
			newPassword: input.newPassword,
			token: input.token,
		});
	});
