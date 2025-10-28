import { Services } from "@/infra/services";

export type CreateContextOptions = {
	context: ReqContext;
};

export type CreateContext = {
	req: ReqContext["req"];
	res: ReqContext["res"];
	services: Services;
};

export async function createContext({
	context,
}: CreateContextOptions): Promise<CreateContext> {
	const services = new Services(context);

	return {
		req: context.req,
		res: context.res,
		services,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
