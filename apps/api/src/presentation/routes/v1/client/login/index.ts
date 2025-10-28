import z from "zod";
import { base } from "@/main/rpc/base";

const LoginSchema = z
	.object({
		assetversion: z.string().optional(),
		clienttype: z.number().optional(),
		clientversion: z.string().optional(),
		devicecookie: z.string().optional(),
		email: z.email(),
		password: z.string(),
		token: z.string().optional(),
		stayloggedin: z.boolean().optional(),
		type: z.literal("login").optional(),
	})
	.transform((data) => {
		return {
			assetVersion: data.assetversion,
			clientType: data.clienttype,
			clientVersion: data.clientversion,
			deviceCookie: data.devicecookie,
			stayLoggedIn: data.stayloggedin,
			email: data.email,
			password: data.password,
			type: data.type,
			token: data.token,
		};
	});

const LoginFileSchema = z.instanceof(File).transform(async (file) => {
	const contentType = file.type || "text/plain;charset=utf-8";
	const m = /charset=([^;]+)/i.exec(contentType);
	const encoding = m?.[1]?.toLowerCase() || "utf-8";
	const abPromise = await file.arrayBuffer();
	const textPromise = new TextDecoder(encoding).decode(abPromise);

	return LoginSchema.parse(JSON.parse(textPromise));
});

export const loginRoute = base
	.route({
		method: "POST",
		path: "/login",
		tags: ["Client"],
		summary: "Client login",
		description: "Endpoint for client login",
	})
	.input(z.instanceof(File))
	.handler(async ({ input }) => {
		const data = await LoginFileSchema.safeParseAsync(input);

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

		console.log("Client login input:", data);

		return [];
	});
