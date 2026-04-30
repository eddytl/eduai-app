<template>
  <div class="flex h-screen bg-gray-50 font-sans overflow-hidden">

    <!-- ═══ SIDEBAR ADMIN ═══ -->
    <aside class="w-56 shrink-0 bg-gray-900 flex flex-col">
      <div class="px-5 py-5 border-b border-gray-800">
        <span class="eduai-logo-admin text-lg block">EduAI</span>
        <span class="text-[11px] text-gray-500 font-medium uppercase tracking-widest">Admin</span>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1">
        <button
          v-for="item in navItems" :key="item.key"
          @click="view = item.key"
          :class="['w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition',
            view === item.key ? 'bg-blue-600 text-white font-medium' : 'text-gray-400 hover:bg-gray-800 hover:text-white']"
        >
          <span class="text-base">{{ item.icon }}</span>
          {{ item.label }}
        </button>
      </nav>

      <div class="px-4 py-4 border-t border-gray-800 space-y-2">
        <RouterLink to="/chat" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Retour à l'app
        </RouterLink>
        <button @click="handleLogout" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-xl transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>

    <!-- ═══ CONTENU ═══ -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

      <!-- Header -->
      <header class="shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-lg font-bold text-gray-900">{{ currentNav?.label }}</h1>
          <p class="text-xs text-gray-400">{{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            {{ initials }}
          </div>
          <span class="font-medium text-gray-700">{{ auth.user?.name }}</span>
        </div>
      </header>

      <!-- ═══ DASHBOARD ═══ -->
      <div v-if="view === 'dashboard'" class="flex-1 overflow-y-auto px-6 py-6">

        <!-- Stat cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div v-for="card in statCards" :key="card.label" class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-2xl">{{ card.icon }}</span>
              <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full', card.badge]">{{ card.trend }}</span>
            </div>
            <p class="text-2xl font-extrabold text-gray-900">{{ card.value }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ card.label }}</p>
          </div>
        </div>

        <!-- Répartition par classe + plan -->
        <div class="grid lg:grid-cols-2 gap-6">

          <!-- Par classe -->
          <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 class="font-semibold text-gray-900 mb-4">Élèves par classe</h3>
            <div v-if="loading" class="text-sm text-gray-400">Chargement…</div>
            <div v-else class="space-y-2.5">
              <div v-for="item in stats.byClasse" :key="item._id" class="flex items-center gap-3">
                <span class="text-xs text-gray-500 w-20 shrink-0 capitalize">{{ item._id }}</span>
                <div class="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div class="h-2 bg-blue-500 rounded-full transition-all" :style="{ width: (item.count / stats.total * 100) + '%' }"></div>
                </div>
                <span class="text-xs font-semibold text-gray-700 w-8 text-right">{{ item.count }}</span>
              </div>
            </div>
          </div>

          <!-- Plan breakdown -->
          <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 class="font-semibold text-gray-900 mb-4">Répartition des plans</h3>
            <div class="flex items-center gap-6 mb-4">
              <div class="text-center">
                <p class="text-3xl font-extrabold text-blue-600">{{ stats.premium }}</p>
                <p class="text-xs text-gray-500">Premium</p>
              </div>
              <div class="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                <div class="h-4 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
                  :style="{ width: stats.total ? (stats.premium / stats.total * 100) + '%' : '0%' }"></div>
              </div>
              <div class="text-center">
                <p class="text-3xl font-extrabold text-gray-400">{{ stats.free }}</p>
                <p class="text-xs text-gray-500">Gratuit</p>
              </div>
            </div>
            <p class="text-xs text-gray-400 text-center">
              {{ stats.total ? Math.round(stats.premium / stats.total * 100) : 0 }}% de conversion vers Premium
            </p>
          </div>
        </div>
      </div>

      <!-- ═══ UTILISATEURS ═══ -->
      <div v-if="view === 'users'" class="flex-1 overflow-y-auto px-6 py-6">

        <!-- Filtres -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
          <div class="relative flex-1 min-w-[200px]">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input v-model="search" @input="debouncedSearch" placeholder="Rechercher par nom ou email…"
              class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition" />
          </div>

          <select v-model="filterPlan" @change="loadUsers(1)" class="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 text-gray-700">
            <option value="">Tous les plans</option>
            <option value="free">Gratuit</option>
            <option value="premium">Premium</option>
          </select>

          <select v-model="filterClasse" @change="loadUsers(1)" class="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 text-gray-700">
            <option value="">Toutes les classes</option>
            <option v-for="c in classes" :key="c" :value="c">{{ c }}</option>
          </select>

          <select v-model="filterRole" @change="loadUsers(1)" class="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 text-gray-700">
            <option value="">Tous les rôles</option>
            <option value="user">Élève</option>
            <option value="admin">Admin</option>
          </select>

          <span class="text-xs text-gray-400 ml-auto">{{ pagination.total }} utilisateur{{ pagination.total > 1 ? 's' : '' }}</span>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Utilisateur</th>
                  <th class="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Classe / Série</th>
                  <th class="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</th>
                  <th class="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rôle</th>
                  <th class="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Inscrit le</th>
                  <th class="px-4 py-3.5"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-if="loadingUsers" v-for="i in 5" :key="i" class="animate-pulse">
                  <td class="px-5 py-4"><div class="h-4 bg-gray-100 rounded w-40"></div></td>
                  <td class="px-4 py-4"><div class="h-4 bg-gray-100 rounded w-24"></div></td>
                  <td class="px-4 py-4"><div class="h-4 bg-gray-100 rounded w-16"></div></td>
                  <td class="px-4 py-4"><div class="h-4 bg-gray-100 rounded w-16"></div></td>
                  <td class="px-4 py-4"><div class="h-4 bg-gray-100 rounded w-24"></div></td>
                  <td class="px-4 py-4"></td>
                </tr>
                <tr v-else v-for="user in users" :key="user._id" class="hover:bg-gray-50 transition group">
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                        {{ user.name?.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() }}
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ user.name }}</p>
                        <p class="text-xs text-gray-400">{{ user.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4 text-gray-600 capitalize">
                    {{ user.classe }}<span v-if="user.serie !== 'sans'" class="text-gray-400"> · {{ user.serie }}</span>
                  </td>
                  <td class="px-4 py-4">
                    <button @click="togglePlan(user)" :class="['text-xs font-semibold px-2.5 py-1 rounded-full transition', user.plan === 'premium' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
                      {{ user.plan === 'premium' ? '⭐ Premium' : 'Gratuit' }}
                    </button>
                  </td>
                  <td class="px-4 py-4">
                    <button @click="toggleRole(user)" :class="['text-xs font-semibold px-2.5 py-1 rounded-full transition', user.role === 'admin' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200']">
                      {{ user.role === 'admin' ? '🛡 Admin' : 'Élève' }}
                    </button>
                  </td>
                  <td class="px-4 py-4 text-xs text-gray-400">
                    {{ new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                  </td>
                  <td class="px-4 py-4">
                    <button @click="confirmDelete(user)" class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="!loadingUsers && users.length === 0">
                  <td colspan="6" class="px-5 py-10 text-center text-sm text-gray-400">Aucun utilisateur trouvé</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.pages > 1" class="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
            <span class="text-xs text-gray-400">Page {{ pagination.page }} / {{ pagination.pages }}</span>
            <div class="flex items-center gap-1">
              <button @click="loadUsers(pagination.page - 1)" :disabled="pagination.page <= 1"
                class="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white transition">
                ← Préc.
              </button>
              <button
                v-for="p in paginationRange" :key="p"
                @click="loadUsers(p)"
                :class="['px-3 py-1.5 text-xs border rounded-lg transition', p === pagination.page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-white']"
              >{{ p }}</button>
              <button @click="loadUsers(pagination.page + 1)" :disabled="pagination.page >= pagination.pages"
                class="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white transition">
                Suiv. →
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ═══ MODALE CONFIRMATION SUPPRESSION ═══ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="deleteTarget" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" @click.self="deleteTarget = null">
          <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div class="text-2xl mb-3">🗑️</div>
            <h3 class="font-bold text-gray-900 mb-1">Supprimer cet utilisateur ?</h3>
            <p class="text-sm text-gray-500 mb-5">
              <strong>{{ deleteTarget.name }}</strong> ({{ deleteTarget.email }}) sera définitivement supprimé. Cette action est irréversible.
            </p>
            <div class="flex gap-3">
              <button @click="deleteTarget = null" class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition font-medium">
                Annuler
              </button>
              <button @click="deleteUser" class="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══ TOAST ═══ -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast" class="fixed bottom-5 right-5 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <span>{{ toast }}</span>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store.js'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const router = useRouter()
const auth = useAuthStore()

const view = ref('dashboard')
const loading = ref(false)
const loadingUsers = ref(false)
const toast = ref(null)
const deleteTarget = ref(null)

const navItems = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'users',     icon: '👥', label: 'Utilisateurs' },
]

const classes = ['6eme', '5eme', '4eme', '3eme', 'seconde', 'premiere', 'terminale']

const currentNav = computed(() => navItems.find(n => n.key === view.value))
const initials = computed(() => (auth.user?.name || '?').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase())

// ── Stats ─────────────────────────────────────────────────────
const stats = ref({ total: 0, premium: 0, free: 0, newToday: 0, newMonth: 0, byClasse: [], byPlan: [] })

const statCards = computed(() => [
  { icon: '👥', label: 'Utilisateurs total',    value: stats.value.total,    trend: '+' + stats.value.newMonth + ' ce mois', badge: 'bg-blue-50 text-blue-600' },
  { icon: '⭐', label: 'Abonnés Premium',        value: stats.value.premium,  trend: Math.round(stats.value.total ? stats.value.premium / stats.value.total * 100 : 0) + '%', badge: 'bg-yellow-50 text-yellow-600' },
  { icon: '🆓', label: 'Comptes gratuits',       value: stats.value.free,     trend: '',                                       badge: 'bg-gray-100 text-gray-500' },
  { icon: '🆕', label: "Inscrits aujourd'hui",   value: stats.value.newToday, trend: "aujourd'hui",                            badge: 'bg-green-50 text-green-600' },
])

async function loadStats() {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.get(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
    stats.value = data
  } catch (err) {
    showToast('Erreur chargement stats')
  } finally {
    loading.value = false
  }
}

// ── Users ─────────────────────────────────────────────────────
const users = ref([])
const search = ref('')
const filterPlan = ref('')
const filterClasse = ref('')
const filterRole = ref('')
const pagination = ref({ total: 0, pages: 1, page: 1 })

const paginationRange = computed(() => {
  const { page, pages } = pagination.value
  const range = []
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) range.push(i)
  return range
})

let searchTimer = null
function debouncedSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => loadUsers(1), 350)
}

async function loadUsers(page = 1) {
  loadingUsers.value = true
  try {
    const token = localStorage.getItem('token')
    const params = { page, limit: 15, search: search.value, plan: filterPlan.value, classe: filterClasse.value, role: filterRole.value }
    const { data } = await axios.get(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` }, params })
    users.value = data.users
    pagination.value = { total: data.total, pages: data.pages, page: data.page }
  } catch {
    showToast('Erreur chargement utilisateurs')
  } finally {
    loadingUsers.value = false
  }
}

async function togglePlan(user) {
  const newPlan = user.plan === 'premium' ? 'free' : 'premium'
  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.patch(`${API}/api/admin/users/${user._id}`, { plan: newPlan }, { headers: { Authorization: `Bearer ${token}` } })
    const idx = users.value.findIndex(u => u._id === user._id)
    if (idx !== -1) users.value[idx] = data
    showToast(`Plan mis à jour : ${data.name} → ${newPlan}`)
    loadStats()
  } catch {
    showToast('Erreur mise à jour plan')
  }
}

async function toggleRole(user) {
  if (user._id === (auth.user?.id || auth.user?._id)) return showToast('Impossible de modifier son propre rôle')
  const newRole = user.role === 'admin' ? 'user' : 'admin'
  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.patch(`${API}/api/admin/users/${user._id}`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } })
    const idx = users.value.findIndex(u => u._id === user._id)
    if (idx !== -1) users.value[idx] = data
    showToast(`Rôle mis à jour : ${data.name} → ${newRole}`)
  } catch {
    showToast('Erreur mise à jour rôle')
  }
}

function confirmDelete(user) {
  deleteTarget.value = user
}

async function deleteUser() {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`${API}/api/admin/users/${deleteTarget.value._id}`, { headers: { Authorization: `Bearer ${token}` } })
    users.value = users.value.filter(u => u._id !== deleteTarget.value._id)
    pagination.value.total--
    showToast(`${deleteTarget.value.name} supprimé`)
    deleteTarget.value = null
    loadStats()
  } catch (err) {
    showToast(err.response?.data?.message || 'Erreur suppression')
    deleteTarget.value = null
  }
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}

function showToast(msg) {
  toast.value = msg
  setTimeout(() => { toast.value = null }, 3000)
}

watch(view, (v) => {
  if (v === 'users') loadUsers(1)
})

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.eduai-logo-admin {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>
