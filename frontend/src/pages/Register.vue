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

        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Mot de passe"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            tabindex="-1"
          >
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
            </svg>
          </button>
        </div>

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
          :disabled="!form.classe || seriesForClasse.length <= 1"
          class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
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

        <p v-if="error" class="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{{ error }}</p>

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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store.js'

const router = useRouter()
const auth = useAuthStore()
const form = ref({ name: '', email: '', password: '', classe: '', serie: '', langue: 'fr' })
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const classes = [
  { value: '6eme', label: '6ème' }, { value: '5eme', label: '5ème' },
  { value: '4eme', label: '4ème' }, { value: '3eme', label: '3ème' },
  { value: 'seconde', label: 'Seconde' }, { value: 'premiere', label: 'Première' },
  { value: 'terminale', label: 'Terminale' }
]

const seriesParClasse = {
  '6eme':    [{ value: 'sans', label: 'Sans série' }],
  '5eme':    [{ value: 'sans', label: 'Sans série' }],
  '4eme':    [{ value: 'sans', label: 'Sans série' }],
  '3eme':    [{ value: 'sans', label: 'Sans série' }],
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

// Auto-sélectionne la série quand il n'y a qu'un seul choix possible
watch(() => form.value.classe, () => {
  const series = seriesForClasse.value
  form.value.serie = series.length === 1 ? series[0].value : ''
})

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
