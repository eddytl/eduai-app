import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/users.routes.js'
import adminRoutes from './routes/admin.routes.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api' }))

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connecté')
    app.listen(PORT, () => console.log(`API démarrée sur le port ${PORT}`))
  })
  .catch(err => {
    console.error('Erreur MongoDB:', err.message)
    process.exit(1)
  })
