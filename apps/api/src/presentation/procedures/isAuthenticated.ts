import { oo } from "@orpc/openapi";
import { base } from "@/main/rpc/base";
import { isAuthenticatedMiddleware } from "@/presentation/middlewares/isAuthenticated";

export const isAuthenticatedProcedure = base
	.errors({
		UNAUTHORIZED: oo.spec({}, {}),
	})
	.use(isAuthenticatedMiddleware);
