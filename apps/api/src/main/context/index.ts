export type CreateContextOptions = {
	context: ReqContext;
};

export type CreateContext = {
	req: ReqContext["req"];
	res: ReqContext["res"];
};

export async function createContext({
	context,
}: CreateContextOptions): Promise<CreateContext> {
	return {
		req: context.req,
		res: context.res,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
