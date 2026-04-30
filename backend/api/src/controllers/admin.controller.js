import User from '../models/User.model.js'

export const getStats = async (req, res) => {
  try {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [total, premium, newToday, newMonth, byClasse, byPlan] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ plan: 'premium' }),
      User.countDocuments({ createdAt: { $gte: startOfDay } }),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.aggregate([{ $match: { role: 'user' } }, { $group: { _id: '$classe', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      User.aggregate([{ $group: { _id: '$plan', count: { $sum: 1 } } }])
    ])

    res.json({
      total,
      premium,
      free: total - premium,
      newToday,
      newMonth,
      byClasse,
      byPlan
    })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 15, search = '', plan, classe, role } = req.query
    const query = {}

    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
    if (plan) query.plan = plan
    if (classe) query.classe = classe
    if (role) query.role = role

    const skip = (Number(page) - 1) * Number(limit)
    const [users, total] = await Promise.all([
      User.find(query).select('-password_hash').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query)
    ])

    res.json({ users, total, pages: Math.ceil(total / Number(limit)), page: Number(page) })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password_hash')
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { plan, role, classe, serie, langue } = req.body
    const updates = {}
    if (plan !== undefined) updates.plan = plan
    if (role !== undefined) updates.role = role
    if (classe !== undefined) updates.classe = classe
    if (serie !== undefined) updates.serie = serie
    if (langue !== undefined) updates.langue = langue

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password_hash')
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ message: 'Impossible de supprimer son propre compte' })
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}
