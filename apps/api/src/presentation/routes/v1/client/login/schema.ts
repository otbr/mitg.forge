import z from "zod";

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

export const ClientLoginSchema = {
	input: z.instanceof(File),
	output: z.any(),
	inside: LoginFileSchema,
};
