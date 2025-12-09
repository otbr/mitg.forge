import { base } from "@/infra/rpc/base";
import { discordOauthConfirmLinkRoute } from "./confirm";
import { discordOauthLinkRoute } from "./link";
import { discordOauthUnlinkRoute } from "./unlink";

export const discordOauthRouter = base.prefix("/discord").router({
	link: discordOauthLinkRoute,
	callback: discordOauthConfirmLinkRoute,
	unlink: discordOauthUnlinkRoute,
});
