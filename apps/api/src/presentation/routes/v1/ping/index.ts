import { publicProcedure } from "@/presentation/procedures/public";
import { PingSchema } from "./schema";

export const pingRoute = publicProcedure
	.route({
		method: "GET",
		path: "/ping",
		tags: ["Utils"],
		summary: "Ping endpoint",
		description: "A simple endpoint to check if the server is running",
	})
	.input(PingSchema.input)
	.output(PingSchema.output)
	.handler(() => {
		return { status: "pong" };
	});
