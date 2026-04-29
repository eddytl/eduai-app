import { Router } from 'express'
import { chat } from '../agent.js'

const router = Router()

// POST /chat
// Body: { userId, messages: [{ role, content }] }
router.post('/', async (req, res) => {
  const { userId, messages } = req.body

  if (!userId || !messages?.length) {
    return res.status(400).json({ message: 'userId et messages sont requis' })
  }

  try {
    const result = await chat({ userId, messages })
    res.json(result)
  } catch (err) {
    console.error('Erreur agent:', err.message)
    res.status(500).json({ message: 'Erreur agent IA', error: err.message })
  }
})

export default router
