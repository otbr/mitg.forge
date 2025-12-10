import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import type { HttpClient } from "../http";
import type { DiscordTokenResponse, DiscordUserResponse } from "./types";

@injectable()
export class DiscordApiClient {
	constructor(
		@inject(TOKENS.DiscordHttpClient) private readonly httpClient: HttpClient,
	) {}

	getRouteOauthRoute() {
		return `${env.DISCORD_API_URL}/api/oauth2/authorize`;
	}

	async exchangeCodeForToken(code: string): Promise<DiscordTokenResponse> {
		if (
			!env.DISCORD_CLIENT_ID ||
			!env.DISCORD_CLIENT_SECRET ||
			!env.DISCORD_REDIRECT_URI
		) {
			throw new Error("Discord OAuth2 environment variables are not set.");
		}

		const params = new URLSearchParams({
			client_id: env.DISCORD_CLIENT_ID,
			client_secret: env.DISCORD_CLIENT_SECRET,
			grant_type: "authorization_code",
			code,
			redirect_uri: env.DISCORD_REDIRECT_URI,
		});

		const response = await this.httpClient.post(
			"/api/oauth2/token",
			params.toString(),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);

		return response.data as DiscordTokenResponse;
	}

	async getUserInfo(accessToken: string): Promise<DiscordUserResponse> {
		const response = await this.httpClient.get("/api/users/@me", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		return response.data as DiscordUserResponse;
	}
}
