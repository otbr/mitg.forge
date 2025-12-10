export enum DiscordErrorCode {
	MissingLinkedAccount = "MISSING_LINKED_ACCOUNT",
	AccountNotFound = "ACCOUNT_NOT_FOUND",
	MissingPermissionConfig = "MISSING_PERMISSION_CONFIG",
	ForbiddenPermission = "FORBIDDEN_PERMISSION",
}

type DiscordErrorOptions = {
	message?: string;
	userMessage?: string;
};

export class DiscordError extends Error {
	readonly code: DiscordErrorCode;
	readonly userMessage?: string;

	constructor(code: DiscordErrorCode, options?: DiscordErrorOptions) {
		super(options?.message ?? code);
		this.name = "DiscordError";
		this.code = code;
		this.userMessage = options?.userMessage;
	}

	static is(error: unknown): error is DiscordError {
		return error instanceof DiscordError;
	}
}
