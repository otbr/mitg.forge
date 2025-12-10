import type z from "zod";

export const BUTTON_ID_PREFIX = {
	ACCOUNT_SHOW: "account_show",
} as const;

export type ButtonIdPrefix =
	(typeof BUTTON_ID_PREFIX)[keyof typeof BUTTON_ID_PREFIX];

export function encodePayload(payload?: unknown): string {
	if (!payload) {
		return "";
	}

	const json = JSON.stringify(payload);
	return Buffer.from(json, "utf-8").toString("base64");
}

export function decodePayload<T>(encoded?: string): T | null {
	if (!encoded) {
		return null;
	}

	try {
		const json = Buffer.from(encoded, "base64").toString("utf-8");
		return JSON.parse(json) as T;
	} catch {
		return null;
	}
}

export function makeButtonId(
	prefix: ButtonIdPrefix,
	payload?: unknown,
): string {
	const encodedPayload = encodePayload(payload);

	return `${prefix}:${encodedPayload}`;
}

export function parseButtonId<TSchema extends z.ZodTypeAny>(data: {
	customId: string;
	expectedPrefix: ButtonIdPrefix;
	schema: TSchema;
}): z.infer<TSchema> {
	const [prefix, encodedPayload] = data.customId.split(":");

	if (prefix !== data.expectedPrefix) {
		throw new Error(
			`Invalid prefix: expected ${data.expectedPrefix}, got ${prefix}`,
		);
	}

	const raw = decodePayload<unknown>(encodedPayload);

	return data.schema.parse(raw);
}
