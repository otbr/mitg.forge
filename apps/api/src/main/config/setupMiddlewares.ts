import { honoCors } from "@/main/middlewares/cors";
import { honoRequestId } from "@/main/middlewares/request_id";

export function setupMiddlewares(app: ExtendedHono): void {
	app.use(honoCors());
	app.use(honoRequestId());
}
