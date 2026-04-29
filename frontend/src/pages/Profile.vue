<template>
  <div class="flex flex-col h-screen bg-white">

    <!-- Header -->
    <header class="border-b border-gray-100 px-6 py-3 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <RouterLink to="/chat" class="text-gray-400 hover:text-gray-600 transition mr-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </RouterLink>
        <span class="font-semibold text-blue-700 text-base">EduAI</span>
        <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">Profil</span>
      </div>
      <button @click="handleLogout" class="text-xs text-gray-400 hover:text-red-500 transition">
        Déconnexion
      </button>
    </header>

    <!-- Contenu -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-xl mx-auto px-6 py-10">

        <!-- Avatar -->
        <div class="flex items-center gap-4 mb-8">
          <div class="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl shrink-0">
            {{ initials }}
          </div>
          <div>
            <p class="font-semibold text-gray-900">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ auth.user?.email }}</p>
            <span class="inline-block mt-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {{ auth.user?.plan === 'premium' ? '⭐ Premium' : 'Gratuit · 10 msg/jour' }}
            </span>
          </div>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Nom complet</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Classe</label>
            <select
              v-model="form.classe"
              required
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option v-for="c in classes" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Série</label>
            <select
              v-model="form.serie"
              required
              :disabled="seriesForClasse.length <= 1"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option v-for="s in seriesForClasse" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Langue de réponse</label>
            <select
              v-model="form.langue"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          <!-- Feedback -->
          <p v-if="error" class="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{{ error }}</p>
          <p v-if="success" class="text-green-600 text-xs bg-green-50 px-3 py-2 rounded-lg">{{ success }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl py-2.5 text-sm transition"
          >
            {{ loading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
          </button>
        </form>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store.js'
import { useChatStore } from '../stores/chat.store.js'

const router = useRouter()
const auth = useAuthStore()
const chat = useChatStore()

const loading = ref(false)
const error = ref('')
const success = ref('')

const form = ref({
  name: auth.user?.name || '',
  classe: auth.user?.classe || '',
  serie: auth.user?.serie || '',
  langue: auth.user?.langue || 'fr'
})

const initials = computed(() => {
  return (auth.user?.name || '?')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

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

watch(() => form.value.classe, () => {
  const series = seriesForClasse.value
  if (series.length === 1) form.value.serie = series[0].value
  else if (!series.find(s => s.value === form.value.serie)) form.value.serie = ''
})

async function handleSave() {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    await auth.updateProfile(form.value)
    success.value = 'Profil mis à jour avec succès.'
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la sauvegarde'
  } finally {
    loading.value = false
  }
}

function handleLogout() {
  auth.logout()
  chat.clearMessages()
  router.push('/login')
}
</script>
