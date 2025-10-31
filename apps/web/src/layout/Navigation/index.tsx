import { BoxDownload } from "../../components/Box/Download";
import { BoxLogin } from "../../components/Box/Login";

export const Navigation = () => {
	return (
		<nav
			className="relative hidden flex-col items-center gap-4 xl:flex"
			style={{
				gridArea: "navigation",
			}}
		>
			<BoxLogin />
			<BoxDownload />
		</nav>
	);
};
