<template>
  <div class="flex flex-col h-screen bg-gray-50">

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-3">
        <span class="text-2xl font-bold text-blue-700">EduAI</span>
        <span class="hidden sm:block text-gray-400">|</span>
        <span class="hidden sm:block text-sm text-gray-600">Tuteur IA Cameroun</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
          {{ auth.user?.name }} · {{ auth.user?.classe }} {{ auth.user?.serie !== 'sans' ? auth.user?.serie : '' }}
        </span>
        <button
          @click="handleLogout"
          class="text-sm text-gray-500 hover:text-red-500 transition"
        >
          Déconnexion
        </button>
      </div>
    </header>

    <!-- Messages -->
    <div ref="messagesEl" class="flex-1 overflow-y-auto px-4 py-6 space-y-4">

      <!-- Message de bienvenue -->
      <div v-if="chat.messages.length === 0" class="flex flex-col items-center justify-center h-full text-center gap-4">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">🎓</div>
        <h2 class="text-xl font-semibold text-gray-700">Bonjour, {{ auth.user?.name }} !</h2>
        <p class="text-gray-500 max-w-sm">
          Je suis ton tuteur IA. Pose-moi n'importe quelle question sur tes cours,
          demande des exercices ou des explications.
        </p>
        <div class="flex flex-wrap gap-2 justify-center mt-2">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            @click="sendSuggestion(suggestion)"
            class="text-sm bg-white border border-blue-200 text-blue-600 rounded-full px-4 py-2 hover:bg-blue-50 transition"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div
        v-for="(msg, i) in chat.messages"
        :key="i"
        :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
      >
        <div
          :class="[
            'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
            msg.role === 'user'
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
          ]"
          v-html="formatMessage(msg.content)"
        />
      </div>

      <!-- Indicateur de frappe -->
      <div v-if="chat.loading" class="flex justify-start">
        <div class="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
          <span class="flex gap-1">
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0ms" />
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:150ms" />
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:300ms" />
          </span>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="bg-white border-t border-gray-200 px-4 py-3">
      <form @submit.prevent="handleSend" class="flex gap-3 items-end max-w-4xl mx-auto">
        <textarea
          v-model="input"
          placeholder="Pose ta question ici..."
          rows="1"
          @keydown.enter.exact.prevent="handleSend"
          :disabled="chat.loading"
          class="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          style="max-height: 120px;"
          @input="autoResize"
          ref="textareaEl"
        />
        <button
          type="submit"
          :disabled="!input.trim() || chat.loading"
          class="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl px-5 py-3 font-medium transition shrink-0"
        >
          Envoyer
        </button>
      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store.js'
import { useChatStore } from '../stores/chat.store.js'

const router = useRouter()
const auth = useAuthStore()
const chat = useChatStore()
const input = ref('')
const messagesEl = ref(null)
const textareaEl = ref(null)

const suggestions = [
  'Explique-moi les dérivées',
  'Donne-moi des exercices de maths',
  'Résume la guerre froide',
  'C\'est quoi la photosynthèse ?'
]

async function handleSend() {
  const content = input.value.trim()
  if (!content) return
  input.value = ''
  if (textareaEl.value) textareaEl.value.style.height = 'auto'
  await chat.sendMessage(auth.user.id, content)
}

async function sendSuggestion(text) {
  input.value = text
  await handleSend()
}

function handleLogout() {
  auth.logout()
  chat.clearMessages()
  router.push('/login')
}

function autoResize(e) {
  e.target.style.height = 'auto'
  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
}

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-xs">$1</code>')
    .replace(/\n/g, '<br>')
}

watch(() => chat.messages.length, async () => {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
})
</script>
