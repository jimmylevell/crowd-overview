import { unstable_getServerSession } from "next-auth/next"
import { getCheckpoints, updateCheckpoint, createCheckpoint, deleteCheckpoint, Checkpoint } from "../../model/Checkpoint"
import logger from "../../services/logger"
import { authOptions } from "./auth/[...nextauth]"


const handler = async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    const email = session?.user?.email

    if (!email) return res.status(401).json({ response: 'error', message: 'Not signed in' })

    const get = async() => {
      try {
        let checkpoints = await getCheckpoints()
        logger.info('Logs retrieved')
        res.status(200).json({ response: 'success', checkpoints: checkpoints })
      }
      catch (ex) {
        logger.error(ex)
        res.status(500).json({ response: 'error', checkpoints: "" })
      }
    }

    const post = async(checkpoint: Checkpoint) => {
      if(req.body.checkpoint) {
        try {
          let checkpoint = await createCheckpoint(req.body.checkpoint)
          logger.info('Logs retrieved')
          res.status(200).json({ response: 'success', checkpoint: checkpoint })
        }
        catch (ex) {
          logger.error(ex)
          res.status(500).json({ response: 'error', checkpoint: "" })
        }
      }
    }

    const put = async(checkpoint: Checkpoint) => {¨
      if(req.body.checkpoint) {
        try {
          let checkpoint = await updateCheckpoint(req.body.checkpoint)
          logger.info('Logs retrieved')
          res.status(200).json({ response: 'success', checkpoint: checkpoint })
        }
        catch (ex) {
          logger.error(ex)
          res.status(500).json({ response: 'error', checkpoint: "" })
        }
      }
    }

    const deleteCheckpoint = async(checkpoint: Checkpoint) => {
      if(req.body.checkpoint) {
        try {
          let checkpoint = await deleteCheckpoint(req.body.checkpoint)
          logger.info('Logs retrieved')
          res.status(200).json({ response: 'success', checkpoint: checkpoint })
        }
        catch (ex) {
          logger.error(ex)
          res.status(500).json({ response: 'error', checkpoint: "" })
        }
      }
    }

    switch (req.method) {
        case 'GET':
          get()
          break
        case 'POST':
          post(req.body.checkpoint)
          break
        case 'PUT':
          put(req.body.checkpoint)
          break
        case 'DELETE':
          delete(req.body.checkpoint)
        default:
          res.status(405).json({ response: 'error', message: 'Method not allowed' })
          break
    }
}

export default handler
