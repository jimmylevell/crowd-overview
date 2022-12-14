import { unstable_getServerSession } from 'next-auth/next'
import Pusher from 'pusher'

import {
  getMeasurementsByCheckpointId,
  createMeasurements,
} from '../../../../model/Measurement'
import { getCheckpointByAPIKey } from '../../../../model/Checkpoint'
import logger from '../../../../services/logger'
import { authOptions } from '../../auth/[...nextauth]'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: 'eu',
  useTLS: true,
})

/**
 * @swagger
 * /api/checkpoint/measurement/{id}:
 *  get:
 *     description: Returns the measurements of a checkpoint
 *     responses:
 *       200:
 *         description: JSON object with the measurements of a checkpoint
 *  post:
 *     description: creating a new measurment on a checkpoint
 *     responses:
 *       200:
 *         description: JSON object with the current measurement
 */
const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const email = session?.user?.email
  const token = req.headers.authorization?.substring(7)

  if (req.method === 'GET') {
    try {
      const checkpoint_id = req.query.pid
      // for viewing user must be logged in
      if (!email)
        return res
          .status(401)
          .json({ response: 'error', message: 'Not signed in' })

      const measurements = await getMeasurementsByCheckpointId(checkpoint_id)
      logger.info('Measurements retrieved')
      res.status(200).json({ response: 'success', measurements: measurements })
    } catch (ex) {
      logger.error(ex)
      res.status(500).json({ response: 'error', measurements: '' })
    }
  } else if (req.method === 'POST') {
    try {
      let measurements = []

      // for creating measurments must be authenticated using token
      const checkpoint = await getCheckpointByAPIKey(token)
      if (!checkpoint)
        return res.status(401).json({
          response: 'error',
          message: 'Not authenticated, please provide API key',
        })

      measurements = await createMeasurements(checkpoint, req.body.measurements)
      logger.info('Measurements uploaded successfully')
      res.status(200).json({ response: 'success', measurements: measurements })

      pusher.trigger('measurement', 'new_measurement_' + checkpoint._id, {
        measurements: measurements,
      })
    } catch (ex) {
      logger.error(ex)
      res.status(500).json({ response: 'error', measurements: '' })
    }
  } else {
    res.status(405).json({ response: 'error', message: 'Method not allowed' })
  }
}

export default handler
