import { unstable_getServerSession } from "next-auth/next"
import { getLogs } from "../../model/LogEntry"
import logger from "../../services/logger"
import { authOptions } from "./auth/[...nextauth]"

const handler = async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    const email = session?.user?.email

    if (!email) return res.status(401).json({ response: 'error', message: 'Not signed in' })

    try {
        let logs = await getLogs()
        logger.info('Logs retrieved')
        res.status(200).json({ response: 'success', logs: logs })
      }
      catch (ex) {
        logger.error(ex)
        res.status(500).json({ response: 'error', logs: "" })
      }
}

export default handler
