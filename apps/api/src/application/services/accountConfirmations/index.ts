import { ORPCError } from "@orpc/client";
import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { AccountConfirmationsRepository } from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class AccountConfirmationsService {
	constructor(
		@inject(TOKENS.AccountConfirmationsRepository)
		private readonly accountConfirmationsRepository: AccountConfirmationsRepository,
	) {}

	@Catch()
	async verifyConfirmation(
		confirmation: {
			id: number;
			max_attempts: number;
			attempts: number;
			expires_at: Date;
			cancelled_at: Date | null;
			confirmed_at: Date | null;
			token: string;
		} | null,
		token?: string,
	) {
		if (!confirmation || !token) {
			throw new ORPCError("NOT_FOUND", {
				message: "No confirmation request found has expired",
			});
		}

		const isConfirmed = confirmation.confirmed_at !== null;

		if (isConfirmed) {
			throw new ORPCError("FORBIDDEN", {
				message: "Confirmation request has already been confirmed",
			});
		}

		const isCancelled = confirmation.cancelled_at !== null;

		if (isCancelled) {
			throw new ORPCError("FORBIDDEN", {
				message: "Confirmation request has been cancelled",
			});
		}

		const maxAttempts = confirmation.max_attempts;
		const previousAttempts = confirmation.attempts;
		const actualAttempts = previousAttempts + 1;

		if (actualAttempts > maxAttempts) {
			await this.accountConfirmationsRepository.update(confirmation.id, {
				cancelledAt: new Date(),
				attempts: actualAttempts,
				lastAttemptAt: new Date(),
			});

			throw new ORPCError("FORBIDDEN", {
				message: "Maximum confirmation attempts exceeded",
			});
		}

		const isExpired = confirmation.expires_at < new Date();

		if (isExpired) {
			throw new ORPCError("FORBIDDEN", {
				message: "Confirmation code has expired",
			});
		}

		if (confirmation.token !== token) {
			await this.accountConfirmationsRepository.update(confirmation.id, {
				attempts: actualAttempts,
				lastAttemptAt: new Date(),
			});

			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid confirmation token",
			});
		}

		await this.accountConfirmationsRepository.update(confirmation.id, {
			confirmedAt: new Date(),
			attempts: actualAttempts,
			lastAttemptAt: new Date(),
		});
	}
}
