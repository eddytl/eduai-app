import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  classe: String,
  serie: String,
  langue: String,
  plan: String
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export const studentTools = [
  {
    name: 'get_student_profile',
    description: "Récupère le profil d'un élève (nom, classe, série, langue) pour personnaliser les réponses de l'agent.",
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          description: "L'identifiant MongoDB de l'élève"
        }
      },
      required: ['user_id']
    },
    handler: async ({ user_id }) => {
      const user = await User.findById(user_id).select('name classe serie langue plan')
      if (!user) throw new Error('Élève introuvable')
      return {
        id: user._id.toString(),
        name: user.name,
        classe: user.classe,
        serie: user.serie,
        langue: user.langue,
        plan: user.plan
      }
    }
  }
]
