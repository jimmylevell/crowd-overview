import { Message, validate, mapRecipients } from "../../model/Message"
import { processMessage } from "../../services/sender"
import { log } from "../../model/LogEntry"
import logger from "../../services/logger"

const handler = async (req, res) => {
  const token = req.headers.authorization?.substring(7)
  const group = (JSON.parse(process.env.SENDER_KEYS) || {})[token]

  if (!group) return res.status(401).json({ response: 'error', message: 'Not authenticated, please provide API key' })

  const message: Message = { from: group, body: req.body.message || "", to: mapRecipients(req.body.phonenumbers) }
  const validationResult = validate(message)

  if (!validationResult.ok) return res.status(400).json({ response: 'error', message: validationResult.message })

  try {
    await processMessage(message)
    await log(message)
    logger.info("Info: Message sent")
    res.status(200).json({ response: 'success', message: 'Message sent successful' })
  }
  catch (ex) {
    logger.error(ex)
    res.status(500).json({ response: 'error', message: ex })
  }
}

export default handler
