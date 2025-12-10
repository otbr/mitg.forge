import { ORPCError } from "@orpc/client";
import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { DiscordApiClient } from "@/domain/clients";
import type { ExecutionContext } from "@/domain/context";
import type {
	AccountConfirmationsRepository,
	AccountOauthRepository,
	AccountRepository,
} from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import type { AccountConfirmationsService } from "../accountConfirmations";

@injectable()
export class AccountOauthService {
	constructor(
		@inject(TOKENS.AccountConfirmationsService)
		private readonly accountConfirmationsService: AccountConfirmationsService,
		@inject(TOKENS.AccountConfirmationsRepository)
		private readonly accountConfirmationsRepository: AccountConfirmationsRepository,
		@inject(TOKENS.ExecutionContext)
		private readonly executionContext: ExecutionContext,
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
		@inject(TOKENS.AccountOauthRepository)
		private readonly accountOauthRepository: AccountOauthRepository,
		@inject(TOKENS.DiscordApiClient)
		private readonly discordApiClient: DiscordApiClient,
	) {}

	@Catch()
	async requestDiscordLink() {
		if (!env.DISCORD_ENABLED) {
			throw new ORPCError("UNAVAILABLE", {
				message: "[Discord] integration is disabled",
			});
		}

		const session = this.executionContext.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const alreadyLink =
			await this.accountOauthRepository.findByProviderAccountId(
				"DISCORD",
				account.id,
			);

		if (alreadyLink) {
			throw new ORPCError("CONFLICT", {
				message: "This account is already linked to a Discord account",
			});
		}

		const alreadyHasConfirmation =
			await this.accountConfirmationsRepository.findByAccountAndType(
				account.id,
				"DISCORD_OAUTH_LINK",
			);

		if (alreadyHasConfirmation) {
			throw new ORPCError("CONFLICT", {
				message:
					"There is already a pending Discord link confirmation for this account",
				data: {
					expiresAt: alreadyHasConfirmation.expires_at,
				},
			});
		}

		const { token, tokenHash, expiresAt } =
			await this.accountConfirmationsService.generateTokenAndHash(5);

		await this.accountConfirmationsRepository.create(account.id, {
			channel: "CODE",
			type: "DISCORD_OAUTH_LINK",
			tokenHash,
			expiresAt,
		});

		if (!env.DISCORD_CLIENT_ID || !env.DISCORD_REDIRECT_URI) {
			throw new ORPCError("UNAVAILABLE", {
				message: "Discord OAuth configuration is missing",
			});
		}

		const params = new URLSearchParams({
			client_id: env.DISCORD_CLIENT_ID,
			redirect_uri: env.DISCORD_REDIRECT_URI,
			response_type: "code",
			scope: ["identify", "email"].join(" "),
			state: token,
			prompt: "consent",
		});

		const discordBaseUrl = this.discordApiClient.getRouteOauthRoute();

		return {
			url: `${discordBaseUrl}?${params.toString()}`,
		};
	}

	@Catch()
	async confirmDiscordLink(code: string, state: string) {
		if (!env.DISCORD_ENABLED) {
			throw new ORPCError("UNAVAILABLE", {
				message: "[Discord] integration is disabled",
			});
		}

		const session = this.executionContext.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const confirmation = await this.accountConfirmationsService.isValid(state);

		const token = await this.discordApiClient.exchangeCodeForToken(code);
		const discordUser = await this.discordApiClient.getUserInfo(
			token.access_token,
		);

		await this.accountOauthRepository.upsert(
			{
				accessToken: token.access_token,
				provider: "DISCORD",
				avatarUrl: null,
				displayName: discordUser.username,
				email: discordUser.email ?? null,
				refreshToken: token.refresh_token ?? null,
				expiresAt: new Date(Date.now() + token.expires_in * 1000),
				username: discordUser.username,
			},
			{
				accountId: account.id,
				providerAccountId: discordUser.id,
			},
		);

		await this.accountConfirmationsService.verifyConfirmation(
			confirmation,
			state,
		);

		return {
			url: `${env.FRONTEND_URL}/account/details`,
		};
	}

	@Catch()
	async unlinkDiscord() {
		const session = this.executionContext.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const oauthAccount =
			await this.accountOauthRepository.findByProviderAccountId(
				"DISCORD",
				account.id,
			);

		if (!oauthAccount) {
			throw new ORPCError("NOT_FOUND", {
				message: "No linked Discord account found",
			});
		}

		await this.accountOauthRepository.deleteById(oauthAccount.id);
	}
}
