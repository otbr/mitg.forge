import { base } from "@/main/rpc/base";
import { ClientLoginSchema } from "./schema";

export const loginRoute = base
	.route({
		method: "POST",
		path: "/login",
		tags: ["Client"],
		summary: "Client login",
		description: "Endpoint for client login",
	})
	.input(ClientLoginSchema.input)
	.output(ClientLoginSchema.output)
	.handler(async ({ input, context }) => {
		const data = await ClientLoginSchema.inside.safeParseAsync(input);

		await context.services.client.handle(43);

		if (!data.success) {
			return {
				errorCode: 3,
				errorMessage: "Something went wrong",
			};
		}
		// 3 error common
		// 6 Two-factor by app/token
		// 7 Client is too old
		// 8 Two-factor by email
		// 11 Suspicious login, code sent to email
		// return {
		// 	errorCode: 3,
		// 	errorMessage: "Invalid email or password",
		// };

		context.services.logger.info("Parsed login data:", data);

		return "";
	});
