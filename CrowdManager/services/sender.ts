import { Message } from "../model/Message"
import nodemailer from 'nodemailer'
import SMTPTransport from "nodemailer/lib/smtp-transport"

const smtpOptions: SMTPTransport = {
	port: process.env.SMTP_PORT,
	host: process.env.SMTP_HOST,
	auth: {
		// @ts-ignore
		user: process.env.SMTP_USER || '',
		// @ts-ignore
		pass: process.env.SMTP_PASSWORD || '',
	},
	secure: false,
}
const SPONSORED_BY = process.env.SPONSORED_BY || ''

function split(message: Message): Message[] {
	const chunkSize = 160 - 4
	const chunkAmount = Math.ceil((message.body.length + SPONSORED_BY.length) / chunkSize)
	const chunks = new Array(chunkAmount)
	if (chunkAmount > 10) return []

	for (let i = 0, char = 0; i < chunkAmount; i++, char += chunkSize) {
		let body = `${message.body.substring(char, chunkSize * (i + 1))} ${i + 1}/${chunkAmount}`
		if (i == chunkAmount - 1) body += " - " + SPONSORED_BY
		chunks[i] = { ...message, body }
	}

	return chunks
}

export async function processMessage(message: Message) {
	for (const messagePart of split(message)) {
		await sendMessage(messagePart)
	}
}

export function sendMessage(message: Message) {
	return new Promise((resolve, reject) => {
		nodemailer.createTransport(smtpOptions).sendMail({
			from: smtpOptions.auth.user,
			to: message.to,
			subject: "",
			text: message.body,
		}, (err, info) => {
			if (err) reject(err)
			resolve(info)
		})
	})

}
