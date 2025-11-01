import type { InjectionToken } from "tsyringe";
import type { AccountsService, TibiaClientService } from "@/domain/services";
import type { SessionService } from "@/domain/services/session";
import type { Prisma } from "@/infra/clients";
import type { Cookies } from "@/infra/cookies";
import type { HasherCrypto } from "@/infra/crypto/hasher";
import type { JwtCrypto } from "@/infra/crypto/jwt";
import type { Logger, RootLogger } from "@/infra/logging/logger";
import type { Metadata } from "@/infra/metadata";
import type {
	AccountRepository,
	PlayersRepository,
	SessionRepository,
} from "@/repositories";

export const token = <T>(desc: string) => Symbol(desc) as InjectionToken<T>;

export const TOKENS = {
	// context
	Context: token<ReqContext>("Context"),

	// Logger
	Logger: token<Logger>("Logger"),
	RootLogger: token<RootLogger>("RootLogger"),

	// Clients
	Prisma: token<Prisma>("Prisma"),

	// Utils
	Metadata: token<Metadata>("Metadata"),
	Cookies: token<Cookies>("Cookies"),

	// Crypto
	HasherCrypto: token<HasherCrypto>("HasherCrypto"),
	JwtCrypto: token<JwtCrypto>("JwtCrypto"),

	// Repositories
	AccountRepository: token<AccountRepository>("AccountRepository"),
	PlayersRepository: token<PlayersRepository>("PlayersRepository"),
	SessionRepository: token<SessionRepository>("SessionRepository"),

	// Services
	TibiaClientService: token<TibiaClientService>("TibiaClientService"),
	AccountsService: token<AccountsService>("AccountsService"),
	SessionService: token<SessionService>("SessionService"),
} as const;
