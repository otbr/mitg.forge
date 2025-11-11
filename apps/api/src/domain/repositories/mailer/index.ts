import {
	type PropsOf,
	renderTemplate,
	type TemplateName,
} from "@miforge/email";
import { inject, injectable } from "tsyringe";
import type { Mailer } from "@/domain/modules/clients";
import { TOKENS } from "@/infra/di/tokens";

type DefaultEmailProps<T extends TemplateName> = {
	to: string;
	subject: string;
	input: PropsOf<T>;
};

@injectable()
export class MailerRepository {
	constructor(@inject(TOKENS.Mailer) private readonly mailer: Mailer) {}

	async recoveryKey({ subject, input, to }: DefaultEmailProps<"RecoveryKey">) {
		const html = await renderTemplate("RecoveryKey", input);

		await this.mailer.sendMail({
			to,
			subject,
			html,
		});
	}
}
