import { env } from '@/env'
import {PrismaClient} from 'generated/client'
import {PrismaMariaDb} from "@prisma/adapter-mariadb"



const server_configs: Array<{
  key: string,
  value: string
}> = [{
  key: "db_version",
  value: "57" // migration from crystalserver only to no trigger on the server
}, {
  key: "motd_hash",
  value: ""
}, {
  key: "motd_num",
  value: "0"
}, {
  key: "players_record",
  value: "0"
}]

const adapter = new PrismaMariaDb({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
})

const prisma = new PrismaClient({
				adapter,
				log: ["info", "warn", "error"],
			});

async function main() {
  for (const config of server_configs) {
    const existing = await prisma.server_config.findUnique({
      where: {
        config: config.key
      }
    })

    if (!existing) {
      await prisma.server_config.create({
        data: {
          config: config.key,
          value: config.value
        }
      })
      console.log("[seed] Created server_config:", config.key)
      continue
    }

    console.log("[seed] server_config already exists:", config.key)
  }

  const boostedBoss = await prisma.boosted_boss.findFirst({
    where: {
      boostname: "default"
    }
  })

  if (!boostedBoss) {
    await prisma.boosted_boss.create({
      data: {
        boostname: "default",
        date: "0",
        raceid: "0"
      }
    })
    console.log("[seed] Created default boosted_boss")
  }

  const boostedCreature = await prisma.boosted_creature.findFirst({
    where: {
      boostname: "default"
    }
  })

  if (!boostedCreature) {
    await prisma.boosted_creature.create({
      data: {
        boostname: "default",
        date: "0",
        raceid: "0"
      }
    })
    console.log("[seed] Created default boosted_creature")
  }
  
}


main().then(async () => {
  await prisma.$disconnect()
}).catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})