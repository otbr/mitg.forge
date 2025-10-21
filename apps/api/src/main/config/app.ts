import { Hono } from "hono";
import type { RequestIdVariables } from "hono/request-id";
import { setupMiddlewares } from "@/main/config/setupMiddlewares";
import { setupRoutes } from "@/main/config/setupRoutes";

const app = new Hono<{
	Variables: RequestIdVariables;
}>();

setupMiddlewares(app);
setupRoutes(app);

export { app };
