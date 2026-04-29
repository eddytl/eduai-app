<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-blue-700">Créer un compte</h1>
        <p class="text-gray-500 mt-1">Rejoins EduAI Cameroun</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <input
          v-model="form.name"
          type="text"
          placeholder="Nom complet"
          required
          class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          required
          class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="form.password"
          type="password"
          placeholder="Mot de passe"
          required
          class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          v-model="form.classe"
          required
          class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Ma classe</option>
          <option v-for="c in classes" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>

        <select
          v-model="form.serie"
          required
          :disabled="!form.classe"
          class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50"
        >
          <option value="">Ma série</option>
          <option v-for="s in seriesForClasse" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>

        <select
          v-model="form.langue"
          class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg py-3 transition"
        >
          {{ loading ? 'Inscription...' : "S'inscrire" }}
        </button>
      </form>

      <p class="text-center text-gray-500 text-sm mt-6">
        Déjà un compte ?
        <RouterLink to="/login" class="text-blue-600 font-medium hover:underline">Se connecter</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store.js'

const router = useRouter()
const auth = useAuthStore()
const form = ref({ name: '', email: '', password: '', classe: '', serie: '', langue: 'fr' })
const loading = ref(false)
const error = ref('')

const classes = [
  { value: '6eme', label: '6ème' }, { value: '5eme', label: '5ème' },
  { value: '4eme', label: '4ème' }, { value: '3eme', label: '3ème' },
  { value: 'seconde', label: 'Seconde' }, { value: 'premiere', label: 'Première' },
  { value: 'terminale', label: 'Terminale' }
]

const seriesParClasse = {
  '6eme': [{ value: 'sans', label: 'Sans série' }],
  '5eme': [{ value: 'sans', label: 'Sans série' }],
  '4eme': [{ value: 'sans', label: 'Sans série' }],
  '3eme': [{ value: 'sans', label: 'Sans série' }],
  'seconde': [{ value: 'sans', label: 'Sans série' }],
  'premiere': [
    { value: 'A', label: 'Série A' }, { value: 'C', label: 'Série C' },
    { value: 'D', label: 'Série D' }, { value: 'E', label: 'Série E' },
    { value: 'F', label: 'Série F' }, { value: 'O_Level', label: 'O Level' }
  ],
  'terminale': [
    { value: 'A', label: 'Série A' }, { value: 'C', label: 'Série C' },
    { value: 'D', label: 'Série D' }, { value: 'E', label: 'Série E' },
    { value: 'F', label: 'Série F' }, { value: 'A_Level', label: 'A Level' }
  ]
}

const seriesForClasse = computed(() => seriesParClasse[form.value.classe] || [])

async function handleRegister() {
  loading.value = true
  error.value = ''
  try {
    await auth.register(form.value)
    router.push('/chat')
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur d'inscription"
  } finally {
    loading.value = false
  }
}
</script>
