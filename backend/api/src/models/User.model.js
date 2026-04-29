import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  classe: {
    type: String,
    required: true,
    enum: ['6eme', '5eme', '4eme', '3eme', 'seconde', 'premiere', 'terminale']
  },
  serie: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D', 'E', 'F', 'O_Level', 'A_Level', 'sans']
  },
  langue: {
    type: String,
    required: true,
    enum: ['fr', 'en'],
    default: 'fr'
  },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  }
}, { timestamps: true })

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password_hash)
}

export default mongoose.model('User', userSchema)
