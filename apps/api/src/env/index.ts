import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
	PORT: str({
		default: "4000",
		desc: "The port the server will listen on",
	}),
});
