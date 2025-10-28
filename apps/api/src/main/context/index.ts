import { createRequestContainer } from "@/di/container";
import { Services } from "@/infra/services";

export type CreateContextOptions = {
	context: ReqContext;
};

export type CreateContext = {
	services: Services;
};

export async function createContext({
	context,
}: CreateContextOptions): Promise<CreateContext> {
	const di = createRequestContainer(context);
	const services = new Services(di);

	return {
		services,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
