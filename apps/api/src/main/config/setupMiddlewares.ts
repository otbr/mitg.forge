import { requestId } from "hono/request-id";

export function setupMiddlewares(app: ExtendedHono): void {
	app.use(requestId());
}
