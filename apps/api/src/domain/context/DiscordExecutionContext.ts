import { injectable } from "tsyringe";
import { DiscordError, DiscordErrorCode } from "../../discord/utils/error";
import type { ExecutionContext, ExecutionSource } from "./types";

@injectable()
export class DiscordExecutionContext implements ExecutionContext {
	private _session: AuthenticatedSession | null = null;

	source(): ExecutionSource {
		return "discord";
	}

	ip(): string | null {
		return null;
	}

	userAgent(): string | null {
		return null;
	}

	requestId(): string | null {
		return null;
	}

	bearer(): string | null {
		return null;
	}

	bearerFromCookies(): string | null {
		return null;
	}

	sessionOrNull(): AuthenticatedSession | null {
		return this._session;
	}

	session(): AuthenticatedSession {
		if (!this._session) {
			throw new DiscordError(DiscordErrorCode.MissingLinkedAccount, {
				message: "No authenticated session found in DiscordExecutionContext",
				userMessage: "Por favor, vincule sua conta para usar este comando.",
			});
		}
		return this._session;
	}

	setSession(session: AuthenticatedSession): void {
		this._session = session;
	}
}
