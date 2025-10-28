import { base } from "@/main/rpc/base";
import { clientRouter } from "./client";
import { pingRoute } from "./ping";

export const router = base.router({
	ping: pingRoute,
	client: clientRouter,
});
