import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountCreateSection } from "@/sections/account_create";

export const Route = createLazyFileRoute("/_not_auth/account/create/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountCreateSection />;
}
