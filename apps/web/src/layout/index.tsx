import { Information } from "../components/Information";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { Sidebar } from "./Sidebar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Header />
			<div className="layout-content page-layout">
				<Navigation />
				<Sidebar />
				<main className="layout-main">
					<Information />
					{children}
				</main>
			</div>
			<Footer />
		</>
	);
};
