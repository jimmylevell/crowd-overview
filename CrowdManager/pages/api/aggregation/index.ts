import { unstable_getServerSession } from 'next-auth/next'

import { getAggregations, IAggregation } from '../../../model/Aggregation'
import logger from '../../../services/logger'
import { authOptions } from '../auth/[...nextauth]'

/**
 * @swagger
 * /api/aggregation:
 *   get:
 *     description: get all allgregations
 *     responses:
 *       200:
 *         description: JSON object with all aggregations
 */
const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const email = session?.user?.email

  if (!email)
    return res.status(401).json({ response: 'error', message: 'Not signed in' })

  const get = async () => {
    try {
      const aggregations = await getAggregations()
      logger.info('Aggregations retrieved')
      res.status(200).json({ response: 'success', aggregations: aggregations })
    } catch (ex) {
      logger.error(ex)
      res.status(500).json({ response: 'error', aggregations: '' })
    }
  }

  switch (req.method) {
    case 'GET':
      await get()
      break
    default:
      res.status(405).json({ response: 'error', message: 'Method not allowed' })
      break
  }
}

export default handler
