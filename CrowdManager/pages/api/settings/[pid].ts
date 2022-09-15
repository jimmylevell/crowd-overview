import { unstable_getServerSession } from 'next-auth/next'

import { updateSettings, ISettings } from '../../../model/Settings'
import logger from '../../../services/logger'
import { authOptions } from '../auth/[...nextauth]'

const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const email = session?.user?.email

  if (!email)
    return res.status(401).json({ response: 'error', message: 'Not signed in' })

  const put = async (settings: ISettings) => {
    if (settings) {
      try {
        const new_settings = await updateSettings(settings)
        logger.info('Settings updated')
        res.status(200).json({ response: 'success', settings: new_settings })
      } catch (ex) {
        logger.error(ex)
        res.status(500).json({
          response: 'error',
          message: 'General application error',
          setting: '',
        })
      }
    } else {
      logger.error('Settings body not provided')
      res.status(500).json({
        response: 'error',
        message: 'Body not provided',
        setting: '',
      })
    }
  }

  switch (req.method) {
    case 'PUT':
      await put(req.body.settings)
      break
    default:
      res.status(405).json({ response: 'error', message: 'Method not allowed' })
      break
  }
}

export default handler
