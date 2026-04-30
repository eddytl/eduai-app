import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const AGENT_URL = import.meta.env.VITE_AGENT_URL
const STORAGE_KEY = 'eduai_conversations'
const CURRENT_KEY = 'eduai_current_id'
const MAX_HISTORY = 20

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export const useChatStore = defineStore('chat', () => {
  // Migration : ancien format eduai_messages → nouvelle conversation
  let initial = []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    initial = JSON.parse(stored)
  } else {
    const old = localStorage.getItem('eduai_messages')
    if (old) {
      const msgs = JSON.parse(old)
      if (msgs.length > 0) {
        initial = [{
          id: generateId(),
          title: msgs.find(m => m.role === 'user')?.content?.slice(0, 45) || 'Conversation',
          messages: msgs,
          createdAt: new Date().toISOString()
        }]
      }
      localStorage.removeItem('eduai_messages')
    }
  }

  const conversations = ref(initial)
  const currentId = ref(localStorage.getItem(CURRENT_KEY) || conversations.value[0]?.id || null)
  const loading = ref(false)
  const streaming = ref(false)
  const error = ref(null)

  // Garantit que currentId pointe vers une conversation valide
  if (currentId.value && !conversations.value.find(c => c.id === currentId.value)) {
    currentId.value = conversations.value[0]?.id || null
  }

  const messages = computed(() => {
    const conv = conversations.value.find(c => c.id === currentId.value)
    return conv ? conv.messages : []
  })

  watch(conversations, val => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)), { deep: true })
  watch(currentId, val => val
    ? localStorage.setItem(CURRENT_KEY, val)
    : localStorage.removeItem(CURRENT_KEY)
  )

  function newConversation() {
    const id = generateId()
    const now = new Date().toISOString()
    conversations.value.unshift({
      id,
      title: 'Nouvelle conversation',
      messages: [],
      createdAt: now,
      updatedAt: now
    })
    currentId.value = id
    error.value = null
  }

  function switchConversation(id) {
    currentId.value = id
    error.value = null
  }

  function deleteConversation(id) {
    const idx = conversations.value.findIndex(c => c.id === id)
    if (idx === -1) return
    conversations.value.splice(idx, 1)
    if (currentId.value === id) {
      currentId.value = conversations.value[0]?.id || null
    }
  }

  function renameConversation(id, title) {
    const conv = conversations.value.find(c => c.id === id)
    if (conv && title.trim()) conv.title = title.trim()
  }

  async function sendMessage(userId, content) {
    if (!currentId.value) newConversation()

    const conv = conversations.value.find(c => c.id === currentId.value)
    if (!conv) return

    if (conv.messages.length === 0) {
      conv.title = content.slice(0, 45) + (content.length > 45 ? '...' : '')
    }

    conv.messages.push({ role: 'user', content })
    conv.updatedAt = new Date().toISOString()
    loading.value = true
    error.value = null

    // Supprime les messages user consécutifs (tentatives ratées) pour éviter
    // que Mistral retourne une réponse vide face à une structure invalide
    const raw = conv.messages.slice(-MAX_HISTORY)
    const history = raw.filter((msg, i, arr) => {
      if (msg.role !== 'user') return true
      const next = arr[i + 1]
      return !next || next.role !== 'user'
    })
    let assistantIdx = -1

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${AGENT_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ userId, messages: history })
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      conv.messages.push({ role: 'assistant', content: '' })
      assistantIdx = conv.messages.length - 1
      loading.value = false
      streaming.value = true

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.error) throw new Error(parsed.error)
            if (parsed.delta) conv.messages[assistantIdx].content += parsed.delta
          } catch (e) {
            if (!(e instanceof SyntaxError)) throw e
          }
        }
      }

      if (conv.messages[assistantIdx]?.content === '') {
        conv.messages.splice(assistantIdx, 1)
        throw new Error('Réponse vide')
      }

    } catch {
      if (assistantIdx === -1) conv.messages.pop()
      error.value = 'Impossible de contacter le tuteur. Vérifie ta connexion.'
    } finally {
      loading.value = false
      streaming.value = false
    }
  }

  function clearMessages() {
    conversations.value = []
    currentId.value = null
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(CURRENT_KEY)
    error.value = null
  }

  return {
    conversations, currentId, messages,
    loading, streaming, error,
    newConversation, switchConversation, deleteConversation, renameConversation,
    sendMessage, clearMessages
  }
})
