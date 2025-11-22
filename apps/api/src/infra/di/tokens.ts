import type { InjectionToken } from "tsyringe";
import type {
	AccountsService,
	AuditService,
	PlayersService,
	SessionService,
	TibiaClientService,
	WorldsService,
} from "@/application/services";
import type {
	AccountCancelDeleteCharacterUseCase,
	AccountCharactersBySessionUseCase,
	AccountCreateCharacterUseCase,
	AccountCreateUseCase,
	AccountDeleteCharacterUseCase,
	AccountDetailsBySessionUseCase,
	AccountEditCharacterUseCase,
	AccountFindCharacterUseCase,
	AccountLoginUseCase,
	AccountLogoutUseCase,
	AccountPermissionedUseCase,
	AccountRegistrationUseCase,
	AccountStoreHistoryUseCase,
	AuditAccountUseCase,
	SessionAuthenticatedUseCase,
	SessionInfoUseCase,
	SessionNotAuthenticatedUseCase,
	TibiaLoginUseCase,
	WorldsListUseCase,
} from "@/application/usecases";
import type { Mailer, Prisma, Redis } from "@/domain/clients";
import type {
	Cache,
	CacheKeys,
	Cookies,
	DetectionChanges,
	HasherCrypto,
	JwtCrypto,
	Logger,
	Metadata,
	Pagination,
	PlayerNameDetection,
	RecoveryKey,
	RootLogger,
} from "@/domain/modules";
import type {
	AccountRepository,
	AuditRepository,
	PlayersRepository,
	SessionRepository,
} from "@/domain/repositories";
import type { AccountRegistrationRepository } from "@/domain/repositories/account/registration";
import type { WorldsRepository } from "@/domain/repositories/worlds";
import type { EmailQueue } from "@/jobs/queue/email";
import type { EmailWorker } from "@/jobs/workers/email";

export const token = <T>(desc: string) => Symbol(desc) as InjectionToken<T>;

export const TOKENS = {
	// context
	Context: token<ReqContext>("Context"),

	// Logger
	Logger: token<Logger>("Logger"),
	RootLogger: token<RootLogger>("RootLogger"),

	// Clients
	Prisma: token<Prisma>("Prisma"),
	Mailer: token<Mailer>("Mailer"),
	Redis: token<Redis>("Redis"),
	BullConnection: token<Redis>("BullConnection"),

	// Queues
	EmailQueue: token<EmailQueue>("EmailQueue"),

	// Workers
	EmailWorker: token<EmailWorker>("EmailWorker"),

	// Utils
	Metadata: token<Metadata>("Metadata"),
	Cookies: token<Cookies>("Cookies"),
	Pagination: token<Pagination>("Pagination"),
	DetectionChanges: token<DetectionChanges>("DetectionChanges"),
	PlayerNameDetection: token<PlayerNameDetection>("PlayerNameDetection"),
	Cache: token<Cache>("Cache"),
	CacheKeys: token<CacheKeys>("CacheKeys"),

	// Crypto
	HasherCrypto: token<HasherCrypto>("HasherCrypto"),
	JwtCrypto: token<JwtCrypto>("JwtCrypto"),
	RecoveryKey: token<RecoveryKey>("RecoveryKey"),

	// Repositories
	AccountRepository: token<AccountRepository>("AccountRepository"),
	AccountRegistrationRepository: token<AccountRegistrationRepository>(
		"AccountRegistrationRepository",
	),
	PlayersRepository: token<PlayersRepository>("PlayersRepository"),
	SessionRepository: token<SessionRepository>("SessionRepository"),
	WorldsRepository: token<WorldsRepository>("WorldsRepository"),
	AuditRepository: token<AuditRepository>("AuditRepository"),

	// Services
	TibiaClientService: token<TibiaClientService>("TibiaClientService"),
	AccountsService: token<AccountsService>("AccountsService"),
	SessionService: token<SessionService>("SessionService"),
	WorldsService: token<WorldsService>("WorldsService"),
	PlayersService: token<PlayersService>("PlayersService"),
	AuditService: token<AuditService>("AuditService"),

	// UseCases
	AccountLoginUseCase: token<AccountLoginUseCase>("LoginUseCase"),
	AccountDetailsBySessionUseCase: token<AccountDetailsBySessionUseCase>(
		"AccountDetailsBySessionUseCase",
	),
	AccountLogoutUseCase: token<AccountLogoutUseCase>("AccountLogoutUseCase"),
	AccountPermissionedUseCase: token<AccountPermissionedUseCase>(
		"AccountPermissionedUseCase",
	),
	AccountCharactersBySessionUseCase: token<AccountCharactersBySessionUseCase>(
		"AccountCharactersBySessionUseCase",
	),
	AccountStoreHistoryUseCase: token<AccountStoreHistoryUseCase>(
		"AccountStoreHistoryUseCase",
	),
	AccountRegistrationUseCase: token<AccountRegistrationUseCase>(
		"AccountRegistrationUseCase",
	),
	AccountCreateCharacterUseCase: token<AccountCreateCharacterUseCase>(
		"AccountCreateCharacterUseCase",
	),
	AccountFindCharacterUseCase: token<AccountFindCharacterUseCase>(
		"AccountFindCharacterUseCase",
	),
	AccountEditCharacterUseCase: token<AccountEditCharacterUseCase>(
		"AccountEditCharacterUseCase",
	),
	AccountDeleteCharacterUseCase: token<AccountDeleteCharacterUseCase>(
		"AccountDeleteCharacterUseCase",
	),
	AccountCancelDeleteCharacterUseCase:
		token<AccountCancelDeleteCharacterUseCase>(
			"AccountCancelDeleteCharacterUseCase",
		),
	AccountAuditUseCase: token<AuditAccountUseCase>("AuditAccountUseCase"),
	AccountCreateUseCase: token<AccountCreateUseCase>("AccountCreateUseCase"),

	WorldsListUseCase: token<WorldsListUseCase>("WorldsListUseCase"),

	SessionInfoUseCase: token<SessionInfoUseCase>("SessionInfoUseCase"),
	SessionAuthenticatedUseCase: token<SessionAuthenticatedUseCase>(
		"SessionAuthenticatedUseCase",
	),
	SessionNotAuthenticatedUseCase: token<SessionNotAuthenticatedUseCase>(
		"SessionNotAuthenticatedUseCase",
	),

	TibiaLoginUseCase: token<TibiaLoginUseCase>("TibiaLoginUseCase"),
} as const;
