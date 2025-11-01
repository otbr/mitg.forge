import { base } from "@/main/rpc/base";
import { isNotAuthenticatedMiddleware } from "@/presentation/middlewares/isNotAuthenticated";

export const isNotAuthenticatedProcedure = base.use(
	isNotAuthenticatedMiddleware,
);
