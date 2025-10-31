import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";

export const Information = () => {
	return (
		<Section>
			<SectionHeader color="red">
				<div className="flex h-full w-full justify-between">
					<div className="flex items-center gap-3">first</div>
					<div className="flex items-center gap-3">second</div>
				</div>
			</SectionHeader>
		</Section>
	);
};
