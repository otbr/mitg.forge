src/
├─ core/
│  ├─ req-context.ts            # tipo do contexto por request
│  └─ env.ts                    # carregamento/validação de env (opcional)
│
├─ di/
│  ├─ tokens.ts                 # Symbols/keys de DI
│  ├─ container.ts              # container raiz + fábrica de child container
│  └─ index.ts                  # barrel export
│
├─ infra/
│  ├─ logging/
│  │  ├─ logger.ts              # RootLogger + interface Logger
│  │  └─ request-logger.ts      # makeRequestLogger(root, ctx)
│  ├─ clients/                  # “barreira final” (DB/HTTP/Redis/SQS/etc)
│  │  ├─ db-client.ts
│  │  ├─ http-client.ts
│  │  └─ index.ts
│  ├─ services/
│  │  └─ index.ts               # a façade Services que o router enxerga
│  └─ index.ts
│
├─ repositories/                # depende só de clients (+ opcionalmente ctx)
│  ├─ user.repository.ts
│  ├─ event-schedule.repository.ts
│  └─ index.ts
│
├─ domain/                      # serviços de domínio (orquestram repos)
│  ├─ client-services.service.ts
│  └─ index.ts
│
├─ rpc/                         # oRPC: contexto e routers
│  ├─ context.ts
│  ├─ routers/
│  │  └─ client-services.router.ts
│  └─ index.ts
│
├─ app/
│  ├─ server.ts                 # entrypoint do servidor (import "reflect-metadata")
│  └─ routes.ts                 # se tiver HTTP puro além do oRPC
│
├─ tests/                       # testes (unitários e integrações)
│  ├─ factories/
│  │  └─ test-container.ts      # helper para criar child container de teste
│  └─ *.spec.ts
│
└─ tsconfig.json
