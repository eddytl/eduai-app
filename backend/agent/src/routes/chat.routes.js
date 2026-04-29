import { Router } from 'express'
import { chat, chatStream } from '../agent.js'

const router = Router()

// POST /chat — réponse complète (rétrocompatibilité)
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

// POST /chat/stream — réponse en streaming (SSE)
router.post('/stream', async (req, res) => {
  const { userId, messages } = req.body

  if (!userId || !messages?.length) {
    return res.status(400).json({ message: 'userId et messages sont requis' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no') // désactive le buffering nginx
  res.flushHeaders()

  const ac = new AbortController()
  req.on('close', () => ac.abort())

  try {
    await chatStream({
      userId,
      messages,
      signal: ac.signal,
      onChunk: (delta) => {
        res.write(`data: ${JSON.stringify({ delta })}\n\n`)
      }
    })
    res.write('data: [DONE]\n\n')
  } catch (err) {
    if (!ac.signal.aborted) {
      console.error('Erreur stream agent:', err.message)
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    }
  } finally {
    res.end()
  }
})

export default router
