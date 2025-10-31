import { assets } from "@/assets";
import { cn } from "@/sdk/utils/cn";

export const BorderBox = ({ flipped = false }: { flipped?: boolean }) => {
	return (
		<img
			src={assets.borders.box}
			alt="border-box"
			className={cn({
				"rotate-180 transform": flipped,
			})}
		/>
	);
};
