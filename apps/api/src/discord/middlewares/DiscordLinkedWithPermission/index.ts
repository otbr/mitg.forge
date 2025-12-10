import type { Interaction } from "discord.js";
import { inject, injectable } from "tsyringe";
import type { DiscordButtonHandler } from "@/discord/buttons/base";
import type { DiscordSlashCommand } from "@/discord/commands";
import type { DiscordMiddleware } from "@/discord/middlewares/base";
import { DiscordError, DiscordErrorCode } from "@/discord/utils/error";
import type { ExecutionContext } from "@/domain/context";
import type { AccountRepository } from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import { getAccountType, getAccountTypeId } from "@/shared/utils/account/type";

@injectable()
export class DiscordLinkedWithPermissionMiddleware
	implements DiscordMiddleware
{
	constructor(
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
	) {}

	async handle(
		interaction: Interaction,
		ctx: ExecutionContext,
		next: () => Promise<void>,
		handler?: DiscordSlashCommand | DiscordButtonHandler,
	): Promise<void> {
		const permission = handler?.permission;

		if (!permission) {
			throw new DiscordError(DiscordErrorCode.MissingPermissionConfig, {
				message: "No permission configuration found for handler.",
				userMessage: "Configuração de permissão ausente para este comando.",
			});
		}

		const session = ctx.sessionOrNull();

		if (!session) {
			throw new DiscordError(DiscordErrorCode.MissingLinkedAccount, {
				message: `No linked account found for Discord user ID: ${interaction.user.id}`,
				userMessage: "Você precisa vincular sua conta para usar este comando.",
			});
		}

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new DiscordError(DiscordErrorCode.MissingLinkedAccount, {
				message: `No account found for email: ${session.email}`,
				userMessage: "Você precisa vincular sua conta para usar este comando.",
			});
		}

		const accountType = account.type;
		const permissionType = getAccountTypeId(permission);

		if (accountType < permissionType) {
			const permissionTypeName = getAccountType(permissionType);
			const accountTypeName = getAccountType(accountType);

			throw new DiscordError(DiscordErrorCode.ForbiddenPermission, {
				message: `Insufficient permission: required ${permissionTypeName}, but account type is ${accountTypeName}.`,
				userMessage: `Você não tem permissão para usar este comando. A permissão necessária é ${permissionTypeName}.`,
			});
		}

		return next();
	}
}
