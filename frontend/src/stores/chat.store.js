import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const AGENT_URL = import.meta.env.VITE_AGENT_URL

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const loading = ref(false)

  async function sendMessage(userId, content) {
    messages.value.push({ role: 'user', content })
    loading.value = true

    try {
      const { data } = await axios.post(`${AGENT_URL}/chat`, {
        userId,
        messages: messages.value
      })
      messages.value.push({ role: 'assistant', content: data.reply })
      return data.reply
    } finally {
      loading.value = false
    }
  }

  function clearMessages() {
    messages.value = []
  }

  return { messages, loading, sendMessage, clearMessages }
})
