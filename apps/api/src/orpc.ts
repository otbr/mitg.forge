import type { RouterClient } from "@orpc/server";
import type { router } from "@/presentation/routes/v1";

export type AppRouter = typeof router;
export type AppRouterClient = RouterClient<AppRouter>;
