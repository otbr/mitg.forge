import { base } from "@/infra/rpc/base";
import { changePasswordWithOldRoute } from "./changeWithOld";
import { changePasswordWithTokenRoute } from "./changeWithToken";
import { generatePasswordResetRoute } from "./generateReset";

export const accountPasswordRoutes = base.prefix("/password").router({
	changeWithOld: changePasswordWithOldRoute,
	changeWithToken: changePasswordWithTokenRoute,
	generateReset: generatePasswordResetRoute,
});
