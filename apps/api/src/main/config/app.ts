import { Hono } from "hono";
import { setupMiddlewares } from "@/main/config/setupMiddlewares";
import { setupRoutes } from "@/main/config/setupRoutes";

const app = new Hono<ContextEnv>();

setupMiddlewares(app);
setupRoutes(app);

export { app };
