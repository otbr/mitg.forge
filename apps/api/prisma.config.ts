import path from "node:path";
import { config as dotenv } from "dotenv-flow";

dotenv({
	node_env: process.env.NODE_ENV || "development",
	debug: true,
});

import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: path.join("prisma"),
});
