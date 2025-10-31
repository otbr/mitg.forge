import { cn } from "@/sdk/utils/cn";

export const SectionHeader = ({
	color,
	children,
}: {
	children?: React.ReactNode;
	color: "red" | "green";
}) => {
	const classname = cn({
		'h-7 bg-[url("/assets/background/section-header-red.webp")]':
			color === "red",
		'h-6 bg-[url("/assets/background/section-header-green.webp")]':
			color === "green",
	});

	return (
		<header className={`${classname} relative block bg-repeat-x`}>
			<div className="absolute flex h-full w-full items-center px-2">
				{children}
			</div>
		</header>
	);
};
