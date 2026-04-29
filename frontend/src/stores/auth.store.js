import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isLoggedIn = computed(() => !!token.value)

  function setSession(data) {
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
  }

  async function login(email, password) {
    const { data } = await axios.post(`${API}/api/auth/login`, { email, password })
    setSession(data)
  }

  async function register(payload) {
    const { data } = await axios.post(`${API}/api/auth/register`, payload)
    setSession(data)
  }

  async function updateProfile(payload) {
    const { data } = await axios.put(`${API}/api/users/profile`, payload)
    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  // Restaurer le header axios au chargement
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return { token, user, isLoggedIn, login, register, updateProfile, logout }
})
