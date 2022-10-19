import { unstable_getServerSession } from 'next-auth/next'

import { getSettings, createSettings, ISettings } from '../../../model/Settings'
import logger from '../../../services/logger'
import { authOptions } from '../auth/[...nextauth]'

/**
 * @swagger
 * /api/settings:
 *   get:
 *     description: get all settings of the application
 *     responses:
 *       200:
 *         description: JSON object with all settings
 *   post:
 *     description: adds new settings to the app
 *     responses:
 *       200:
 *         description:JSON object with all settings
*/
const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const email = session?.user?.email

  if (!email)
    return res.status(401).json({ response: 'error', message: 'Not signed in' })

  const get = async () => {
    try {
      const settings = await getSettings()
      logger.info('Settings retrieved')
      res.status(200).json({ response: 'success', settings: settings })
    } catch (ex) {
      logger.error(ex)
      res.status(500).json({ response: 'error', settings: '' })
    }
  }

  const post = async (settings: ISettings) => {
    if (settings) {
      try {
        const new_settings = await createSettings(settings)
        logger.info('Settings created')
        res.status(200).json({ response: 'success', settings: new_settings })
      } catch (ex) {
        logger.error(ex)
        res.status(500).json({
          response: 'error',
          message: 'General application error',
          checkpoint: '',
        })
      }
    } else {
      logger.error('No settings body provided')
      res.status(500).json({
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
      await post(req.body.settings)
      break
    default:
      res.status(405).json({ response: 'error', message: 'Method not allowed' })
      break
  }
}

export default handler
