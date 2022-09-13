import { unstable_getServerSession } from 'next-auth/next'

import {
  getCheckpoints,
  createCheckpoint,
  ICheckpoint,
} from '../../../model/Checkpoint'
import logger from '../../../services/logger'
import { authOptions } from '../auth/[...nextauth]'

const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const email = session?.user?.email

  if (!email)
    return res.status(401).json({ response: 'error', message: 'Not signed in' })

  const get = async () => {
    try {
      let checkpoints = await getCheckpoints()
      logger.info('Checkpoints retrieved')
      res.status(200).json({ response: 'success', checkpoints: checkpoints })
    } catch (ex) {
      logger.error(ex)
      res.status(500).json({ response: 'error', checkpoints: '' })
    }
  }

  const post = async (checkpoint: ICheckpoint) => {
    if (checkpoint) {
      try {
        let new_checkpoint = await createCheckpoint(checkpoint)
        logger.info('Checkpoint created')
        res
          .status(200)
          .json({ response: 'success', checkpoint: new_checkpoint })
      } catch (ex) {
        logger.error(ex)
        res
          .status(500)
          .json({
            response: 'error',
            message: 'General application error',
            checkpoint: '',
          })
      }
    } else {
      logger.error('No checkpoint body provided')
      res
        .status(500)
        .json({
          response: 'error',
          message: 'Body not provided',
          checkpoint: '',
        })
    }
  }

  switch (req.method) {
    case 'GET':
      await get()
      break
    case 'POST':
      await post(req.body.checkpoint)
      break
    default:
      res.status(405).json({ response: 'error', message: 'Method not allowed' })
      break
  }
}

export default handler
