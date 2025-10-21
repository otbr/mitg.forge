import type { Context, Hono } from "hono";
import type { RequestIdVariables } from "hono/request-id";

declare global {
	export type ExtendedHono = Hono<{
		Variables: RequestIdVariables;
	}>;

	export type ReqContext = Context;
}
