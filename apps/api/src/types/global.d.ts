import type { Context, Hono } from "hono";
import type { RequestIdVariables } from "hono/request-id";

declare global {
	export type ContextEnv = {
		Variables: {
			session?: {
				token: string;
				email: string;
			};
		} & RequestIdVariables;
	};

	export type ExtendedHono = Hono<ContextEnv>;
	export type ReqContext = Context<ContextEnv>;
}
