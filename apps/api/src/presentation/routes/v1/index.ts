import { base } from "@/main/rpc/base";

export const router = base.router({
	hello: base.handler(() => {
		return { message: "Hello, world!" };
	}),
});
