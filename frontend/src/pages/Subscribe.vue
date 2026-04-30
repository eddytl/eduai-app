<template>
  <div class="flex flex-col h-screen bg-white dark:bg-gray-950 overflow-hidden">

    <!-- Header -->
    <header class="border-b border-gray-100 dark:border-gray-800 px-6 py-3 flex items-center gap-3 shrink-0">
      <RouterLink to="/chat" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </RouterLink>
      <span class="font-semibold text-blue-700 dark:text-blue-400 text-base">EduAI</span>
      <span class="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">Premium</span>
    </header>

    <!-- Contenu -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-lg mx-auto px-5 py-8">

        <!-- Déjà premium -->
        <div v-if="auth.user?.plan === 'premium'" class="text-center py-12">
          <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Tu es déjà Premium !</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Tu bénéficies de messages illimités et de toutes les fonctionnalités avancées.</p>
          <RouterLink to="/chat" class="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition">
            Retour au chat
          </RouterLink>
        </div>

        <!-- Flow abonnement -->
        <div v-else>

          <!-- Titre -->
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Passer en Premium</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Accès illimité à ton tuteur IA</p>
          </div>

          <!-- Comparaison plans -->
          <div class="grid grid-cols-2 gap-3 mb-8">

            <!-- Gratuit -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
              <p class="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">Gratuit</p>
              <p class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">0 FCFA</p>
              <ul class="space-y-2">
                <li class="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  10 messages / jour
                </li>
                <li class="flex items-start gap-2 text-sm text-gray-400 dark:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-200 dark:text-gray-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Pas de priorité
                </li>
                <li class="flex items-start gap-2 text-sm text-gray-400 dark:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-200 dark:text-gray-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Exercices limités
                </li>
              </ul>
            </div>

            <!-- Premium -->
            <div class="border-2 border-blue-600 dark:border-blue-500 rounded-2xl p-4 relative">
              <div class="absolute -top-2.5 left-1/2 -translate-x-1/2">
                <span class="bg-blue-600 text-white text-xs font-semibold px-3 py-0.5 rounded-full">Recommandé</span>
              </div>
              <p class="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">Premium</p>
              <div class="mb-4">
                <span class="text-xl font-bold text-gray-900 dark:text-gray-100">2 500 FCFA</span>
                <span class="text-xs text-gray-400 dark:text-gray-500"> /mois</span>
              </div>
              <ul class="space-y-2">
                <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Messages illimités
                </li>
                <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Réponses prioritaires
                </li>
                <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Exercices illimités
                </li>
              </ul>
            </div>

          </div>

          <!-- État succès -->
          <div v-if="success" class="text-center py-8">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Paiement confirmé !</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Bienvenue dans Premium. Tu bénéficies maintenant de messages illimités.</p>
            <RouterLink to="/chat" class="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition">
              Commencer à apprendre
            </RouterLink>
          </div>

          <!-- Formulaire de paiement -->
          <form v-else @submit.prevent="handleSubscribe" class="space-y-4">

            <!-- Méthode de paiement -->
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Méthode de paiement</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="form.method = 'mtn'"
                  :class="['flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition text-left', form.method === 'mtn' ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600']"
                >
                  <div class="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center shrink-0">
                    <span class="text-xs font-black text-black leading-none">MTN</span>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-900 dark:text-gray-100">MTN MoMo</p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">67x, 68x, 65x</p>
                  </div>
                </button>

                <button
                  type="button"
                  @click="form.method = 'orange'"
                  :class="['flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition text-left', form.method === 'orange' ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600']"
                >
                  <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                    <span class="text-xs font-black text-white leading-none">OM</span>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-900 dark:text-gray-100">Orange Money</p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">69x</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Numéro de téléphone -->
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Numéro {{ form.method === 'mtn' ? 'MTN' : form.method === 'orange' ? 'Orange' : '' }} Mobile Money
              </label>
              <div class="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                <span class="px-3 py-2.5 text-sm text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0">+237</span>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="6XX XXX XXX"
                  maxlength="9"
                  class="flex-1 px-3 py-2.5 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none"
                />
              </div>
              <p v-if="phoneError" class="text-xs text-red-500 mt-1">{{ phoneError }}</p>
            </div>

            <!-- Résumé commande -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">EduAI Premium</p>
                <p class="text-xs text-gray-400 dark:text-gray-500">Abonnement mensuel</p>
              </div>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100">2 500 <span class="text-sm font-normal text-gray-400">FCFA</span></p>
            </div>

            <!-- Erreur serveur -->
            <p v-if="error" class="text-xs text-red-500 text-center">{{ error }}</p>

            <!-- Bouton payer -->
            <button
              type="submit"
              :disabled="loading || !form.method || !form.phone"
              class="w-full py-3 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              :class="form.method === 'orange' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Traitement en cours…
              </span>
              <span v-else>
                Payer 2 500 FCFA via {{ form.method === 'mtn' ? 'MTN MoMo' : form.method === 'orange' ? 'Orange Money' : 'Mobile Money' }}
              </span>
            </button>

            <p class="text-xs text-center text-gray-400 dark:text-gray-500">
              Paiement sécurisé · Résiliation à tout moment
            </p>

          </form>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth.store.js'

const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const auth = useAuthStore()

const form = ref({ method: 'mtn', phone: '' })
const loading = ref(false)
const error = ref(null)
const success = ref(false)

const phoneError = computed(() => {
  const digits = form.value.phone.replace(/\s/g, '')
  if (!digits) return null
  if (!/^\d+$/.test(digits)) return 'Chiffres uniquement'
  if (digits.length > 0 && digits[0] !== '6') return 'Le numéro doit commencer par 6'
  if (digits.length === 9 && !/^6\d{8}$/.test(digits)) return 'Numéro invalide'
  return null
})

async function handleSubscribe() {
  const digits = form.value.phone.replace(/\s/g, '')
  if (!/^6\d{8}$/.test(digits)) {
    error.value = 'Numéro invalide (format: 6XX XXX XXX)'
    return
  }

  loading.value = true
  error.value = null

  try {
    const token = localStorage.getItem('token')
    const res = await axios.post(
      `${API_URL}/api/users/subscribe`,
      { phone: digits, method: form.value.method },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    auth.user = res.data
    localStorage.setItem('user', JSON.stringify(res.data))
    success.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors du paiement. Réessaie.'
  } finally {
    loading.value = false
  }
}
</script>
