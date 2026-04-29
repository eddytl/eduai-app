import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import chatRoutes from './routes/chat.routes.js'

const app = express()
const PORT = process.env.PORT || 3002

app.use(cors())
app.use(express.json())

app.use('/chat', chatRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'agent' }))

app.listen(PORT, () => console.log(`Agent IA démarré sur le port ${PORT}`))
