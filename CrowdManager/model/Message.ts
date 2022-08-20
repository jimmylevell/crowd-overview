export type Message = {
	from: string;
	to: string[];
	body: string;
}

const SMS_DOMAIN = process.env.SMS_DOMAIN

const MAX_LENGTH = 160 * 6
const MAX_LENGTH_RECIPIENTS = 250

export function mapRecipients(phonenumbers?: string): string[] {
	return phonenumbers?.split(',')?.map(number => `${number.replace(/\s/g, "")}@${SMS_DOMAIN}`) || []
}

export function validate(message: Message) {
	if (message.body.length >= MAX_LENGTH)
		return { ok: false, message: 'Message is too long' };
	if (message.to.length <= 0)
		return { ok: false, message: 'Please provide correct phonenumbers and Message' }
	if (message.to.length >= MAX_LENGTH_RECIPIENTS)
		return { ok: false, message: 'Too many phonenumbers' }

	return { ok: true };
}
