import { Link } from "@tanstack/react-router";
import { MenuBox } from "@/components/Box/Menu";
import { ButtonLink } from "@/ui/Buttons/ButtonLink";

export const BoxLogin = () => {
	return (
		<div>
			<Link
				to="/terms"
				className="-right-0.5 absolute top-[-155px] flex w-full items-center"
			>
				<img
					alt="logo tibia artwork"
					src="/assets/logo/tibia-logo-artwork-top.webp"
				/>
			</Link>
			<MenuBox background chains>
				<div className="flex flex-col items-center gap-1">
					<ButtonLink to="/">Login</ButtonLink>
					<Link to="/" className="fondamento-title text-xs hover:underline">
						Create Account
					</Link>
				</div>
			</MenuBox>
		</div>
	);
};
