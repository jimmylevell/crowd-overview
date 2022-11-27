import { unstable_getServerSession } from 'next-auth/next'

import { getAggregationsByTimeSlot } from '../../../model/Aggregation'
import logger from '../../../services/logger'
import { authOptions } from '../auth/[...nextauth]'

/**
 * @swagger
 * /api/aggregation/{id}:
 *   get:
 *     description: Returns the aggregations of a given timeslot
 *     responses:
 *       200:
 *         description: JSON object with the aggregations of a given timeslot
 */
const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const email = session?.user?.email

  if (req.method === 'GET') {
    try {
      const timeSlot = req.query.pid
      // for viewing user must be logged in
      if (!email)
        return res
          .status(401)
          .json({ response: 'error', message: 'Not signed in' })

      const aggregations = await getAggregationsByTimeSlot(timeSlot)
      logger.info('Aggregations per timeslot retrieved')
      res.status(200).json({ response: 'success', aggregations: aggregations })
    } catch (ex) {
      logger.error(ex)
      res.status(500).json({ response: 'error', aggregations: '' })
    }
  } else {
    res.status(405).json({ response: 'error', message: 'Method not allowed' })
  }
}

export default handler
