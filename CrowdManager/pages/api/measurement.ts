import { unstable_getServerSession } from "next-auth/next"
import { getMeasurements } from "../../model/Measurement"
import logger from "../../services/logger"
import { authOptions } from "./auth/[...nextauth]"

const handler = async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    const email = session?.user?.email

    if (!email) return res.status(401).json({ response: 'error', message: 'Not signed in' })

    if(req.method === 'GET') {
      try {
        let measurements = await getMeasurements()
        logger.info('Logs retrieved')
        res.status(200).json({ response: 'success', measurements: measurements })
      }
      catch (ex) {
        logger.error(ex)
        res.status(500).json({ response: 'error', measurements: "" })
      }
    }
    else {
      res.status(405).json({ response: 'error', message: 'Method not allowed' })
    }
}

export default handler
