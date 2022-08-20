import { unstable_getServerSession } from "next-auth/next"
import { Message, validate, mapRecipients } from "../../model/Message"
import { authOptions } from "./auth/[...nextauth]"
import { processMessage } from "../../services/sender"
import { log } from "../../model/LogEntry"
import logger from "../../services/logger"

const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const email = session?.user?.email

  if (!email) return res.status(401).json({ response: 'error', message: 'Not signed in' })

  const message: Message = { from: email, body: req.body.message, to: mapRecipients(req.body.phonenumbers) }
  const validationResult = validate(message)

  if (!validationResult.ok) return res.status(400).json({ response: 'error', message: validationResult.message })

  try {
    await processMessage(message)
    await log(message)
    logger.info("Message sent")
    res.status(200).json({ response: 'success', message: 'Message sent successful' })
  }
  catch (ex) {
    logger.error(ex)
    res.status(500).json({ response: 'error', message: ex })
  }
}

export default handler
