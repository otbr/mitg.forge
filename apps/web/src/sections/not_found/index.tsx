import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";

export const NotFoundSection = () => {
	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Not Found</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<div className="flex flex-col items-center gap-4">
					<img
						alt="not-found-image-page"
						src="/assets/background/not-found.png"
					/>
					<span className="max-w-sm text-center text-secondary">
						The page you are looking for does not exist. Please check the URL or
						return to the homepage.
					</span>
					<ButtonImageLink variant="info" to="/">
						Home
					</ButtonImageLink>
				</div>
			</InnerSection>
		</Section>
	);
};
