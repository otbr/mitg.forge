import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Layout } from "@/layout";

export const Route = createFileRoute("/_public")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Layout>
			<Outlet />
		</Layout>
	);
}
