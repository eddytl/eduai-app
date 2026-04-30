import { Router } from 'express'
import { getProfile, updateProfile, subscribe } from '../controllers/users.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateProfile)
router.post('/subscribe', authenticate, subscribe)

export default router
