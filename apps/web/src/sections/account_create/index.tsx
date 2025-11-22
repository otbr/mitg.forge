import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountCreateForm } from "./form";

export const AccountCreateSection = () => {
	return (
		<Section>
			<SectionHeader color="green">
				<h1 className="section-title">Create Account</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountCreateForm />
			</InnerSection>
		</Section>
	);
};
