import { Router } from 'express'
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js'
import { getStats, getUsers, getUser, updateUser, deleteUser } from '../controllers/admin.controller.js'

const router = Router()
router.use(authenticate, requireAdmin)

router.get('/stats', getStats)
router.get('/users', getUsers)
router.get('/users/:id', getUser)
router.patch('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

export default router
