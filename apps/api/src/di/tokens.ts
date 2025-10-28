export const TOKENS = {
	// context
	ReqContext: Symbol("ReqContext"),

	// Logger
	Logger: Symbol("Logger"),
	RootLogger: Symbol("RootLogger"),

	// Clients
	Prisma: Symbol("Prisma"),

	// services
	ClientService: Symbol("ClientService"),
} as const;
