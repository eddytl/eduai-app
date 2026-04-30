import User from '../models/User.model.js'

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash')
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

export const subscribe = async (req, res) => {
  try {
    const { phone, method } = req.body
    if (!phone || !method) return res.status(400).json({ message: 'Téléphone et méthode requis' })

    const digits = phone.replace(/\s/g, '')
    if (!/^6\d{8}$/.test(digits)) {
      return res.status(400).json({ message: 'Numéro invalide (format: 6XX XXX XXX)' })
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { plan: 'premium' },
      { new: true }
    ).select('-password_hash')

    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })
    res.json({ id: user._id, name: user.name, email: user.email, classe: user.classe, serie: user.serie, langue: user.langue, plan: user.plan })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, classe, serie, langue } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, classe, serie, langue },
      { new: true, runValidators: true }
    ).select('-password_hash')

    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })
    res.json({ id: user._id, name: user.name, email: user.email, classe: user.classe, serie: user.serie, langue: user.langue, plan: user.plan })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}
