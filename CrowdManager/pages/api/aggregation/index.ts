import { unstable_getServerSession } from "next-auth/next"
import { getAggregations } from "../../../model/Aggregation"
import logger from "../../../services/logger"
import { authOptions } from "../auth/[...nextauth]"

const handler = async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    const email = session?.user?.email

    if (!email) return res.status(401).json({ response: 'error', message: 'Not signed in' })

    if(req.method === 'GET') {
      try {
        let aggreations = await getAggregations()
        logger.info('Logs retrieved')
        res.status(200).json({ response: 'success', aggreations: aggreations })
      }
      catch (ex) {
        logger.error(ex)
        res.status(500).json({ response: 'error', aggreations: "" })
      }
    }
    else {
      res.status(405).json({ response: 'error', message: 'Method not allowed' })
    }
}

export default handler
