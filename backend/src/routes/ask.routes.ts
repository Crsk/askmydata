import { Router } from 'express'
import { askController } from '../controllers/ask.controller'

const router = Router()
router.route('/').post(askController)

export default router