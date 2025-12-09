import type { miforge_account_oauths, OAuthProvider } from "generated/client";
import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class AccountOauthRepository {
	constructor(@inject(TOKENS.Prisma) private readonly database: Prisma) {}

	async findByProviderAccountId(provider: OAuthProvider, accountId: number) {
		return this.database.miforge_account_oauths.findFirst({
			where: {
				provider,
				accountId,
			},
		});
	}

	async deleteById(id: number) {
		return this.database.miforge_account_oauths.delete({
			where: {
				id,
			},
		});
	}

	async upsert(
		params: Pick<
			miforge_account_oauths,
			| "accessToken"
			| "refreshToken"
			| "expiresAt"
			| "username"
			| "displayName"
			| "email"
			| "avatarUrl"
			| "provider"
		>,
		identifiers: {
			accountId: number;
			providerAccountId: string;
		},
	) {
		return this.database.miforge_account_oauths.upsert({
			where: {
				oauth_provider_account_unique: {
					provider: params.provider,
					providerAccountId: identifiers.providerAccountId,
				},
			},
			create: {
				accountId: identifiers.accountId,
				providerAccountId: identifiers.providerAccountId,
				...params,
			},
			update: {
				...params,
			},
		});
	}
}
