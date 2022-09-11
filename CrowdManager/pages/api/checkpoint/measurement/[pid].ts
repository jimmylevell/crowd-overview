import { unstable_getServerSession } from "next-auth/next"
import Pusher from 'pusher'

import { getMeasurementsByCheckpointId, createMeasurements } from "../../../../model/Measurement"
import { getCheckpointByAPIKey } from "../../../../model/Checkpoint"
import logger from "../../../../services/logger"
import { authOptions } from "../../auth/[...nextauth]"

const pusher = new Pusher({
  appId: "1476056",
  key: "0177fb2397ec95132111",
  secret: "c9cf7715c818b232f2e9",
  cluster: "eu",
  useTLS: true
});

const handler = async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    const email = session?.user?.email
    const token = req.headers.authorization?.substring(7)

    if(req.method === 'GET') {
      try {
        const checkpoint_id = req.query.pid
        // for viewing user must be logged in
        if (!email) return res.status(401).json({ response: 'error', message: 'Not signed in' })

        let measurements = await getMeasurementsByCheckpointId(checkpoint_id)
        logger.info('Measurements retrieved')
        res.status(200).json({ response: 'success', measurements: measurements })
      }
      catch (ex) {
        logger.error(ex)
        res.status(500).json({ response: 'error', measurements: "" })
      }
    }
    else if(req.method === 'POST') {
      try {
        let measurements = []

        // for creating measurments must be authenticated using token
        const checkpoint = await getCheckpointByAPIKey(token)
        if (!checkpoint) return res.status(401).json({ response: 'error', message: 'Not authenticated, please provide API key' })

        measurements = await createMeasurements(checkpoint, req.body.measurements)
        logger.info('Measurements uploaded successfully')
        res.status(200).json({ response: 'success', measurements: measurements })

        pusher.trigger("measurement", "new_measurement", {
          measurements: await getMeasurementsByCheckpointId(checkpoint._id)
        });
      }
      catch (ex) {
        logger.error(ex)
        res.status(500).json({ response: 'error', measurements: "" })
      }
    }else {
      res.status(405).json({ response: 'error', message: 'Method not allowed' })
    }
}

export default handler
