import { unstable_getServerSession } from 'next-auth/next'

import {
  Checkpoint,
  updateCheckpoint,
  deleteCheckpoint,
  ICheckpoint,
} from '../../../model/Checkpoint'
import logger from '../../../services/logger'
import { authOptions } from '../auth/[...nextauth]'

const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const email = session?.user?.email

  if (!email)
    return res.status(401).json({ response: 'error', message: 'Not signed in' })

  const put = async (checkpoint: ICheckpoint) => {
    if (checkpoint) {
      try {
        let new_checkpoint = await updateCheckpoint(checkpoint)
        logger.info('Checkpoint updated')
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
      logger.error('Checkpoint body not provided')
      res
        .status(500)
        .json({
          response: 'error',
          message: 'Body not provided',
          checkpoint: '',
        })
    }
  }

  const delete_method = async (id: string) => {
    if (id) {
      try {
        let new_checkpoint = await deleteCheckpoint(id)
        logger.info('Checkpoint removed')
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
      logger.error('Checkpoint id not provided')
      res
        .status(500)
        .json({ response: 'error', message: 'ID not provided', checkpoint: '' })
    }
  }

  switch (req.method) {
    case 'PUT':
      await put(req.body.checkpoint)
      break
    case 'DELETE':
      const { pid } = req.query
      await delete_method(pid)
      break
    default:
      res.status(405).json({ response: 'error', message: 'Method not allowed' })
      break
  }
}

export default handler
