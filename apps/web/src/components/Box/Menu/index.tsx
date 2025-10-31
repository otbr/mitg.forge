import { cn } from "@/sdk/utils/cn";
import { BorderBox } from "../Border";

export const MenuBox = ({
	children,
	background = false,
	chains = false,
}: {
	children?: React.ReactNode;
	background?: boolean;
	chains?: boolean;
}) => {
	const classChains = cn({
		"absolute top-0y h-full w-[7px] bg-[url('/assets/borders/chain.webp')] bg-repeat-y":
			chains,
	});

	return (
		<div className="flex w-[180px] flex-col items-center">
			<BorderBox />
			<div
				className={cn(
					"relative flex h-full w-40 flex-col items-center justify-center px-2 py-0",
					{
						"bg-[url('/assets/background/loginbox-textfield.webp')] bg-repeat-y":
							background,
					},
				)}
			>
				{chains && <div className={`${classChains} -left-1`} />}
				{children}
				{chains && <div className={`${classChains} -right-1 left-auto`} />}
			</div>
			<BorderBox flipped />
		</div>
	);
};
