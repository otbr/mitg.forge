import { base } from "@/infra/rpc/base";
import { discordOauthRouter } from "./discord";

export const oauthRouter = base.prefix("/oauth").router({
	discord: discordOauthRouter,
});
