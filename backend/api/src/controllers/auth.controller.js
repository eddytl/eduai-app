import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

export const register = async (req, res) => {
  try {
    const { name, email, password, classe, serie, langue } = req.body

    if (!name || !email || !password || !classe || !serie) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' })
    }

    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email déjà utilisé' })

    const password_hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password_hash, classe, serie, langue: langue || 'fr' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, classe: user.classe, serie: user.serie, langue: user.langue, plan: user.plan }
    })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' })
    }

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Identifiants incorrects' })

    const valid = await user.comparePassword(password)
    if (!valid) return res.status(401).json({ message: 'Identifiants incorrects' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, classe: user.classe, serie: user.serie, langue: user.langue, plan: user.plan }
    })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash')
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}
