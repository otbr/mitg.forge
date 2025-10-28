import z from "zod";

export const PingSchema = {
	input: z.unknown(),
	output: z.object({
		status: z.string(),
	}),
};
