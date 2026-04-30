<template>
  <div class="flex h-screen bg-white overflow-hidden">

    <!-- Backdrop mobile (sidebar ouverte) -->
    <div
      v-if="sidebarOpen"
      class="md:hidden fixed inset-0 bg-black/40 z-30"
      @click="sidebarOpen = false"
    />

    <!-- ═══ SIDEBAR style DeepSeek ═══ -->
    <aside
      :class="[
        'flex flex-col shrink-0 bg-[#f9f9f9] border-r border-[#e8e8e8] transition-all duration-300 overflow-hidden',
        'fixed inset-y-0 left-0 z-40 md:relative md:inset-auto md:z-auto',
        sidebarOpen
          ? 'w-[240px] translate-x-0'
          : 'w-[240px] -translate-x-full md:-translate-x-0 md:w-14'
      ]"
    >
      <!-- Header : logo + icône toggle -->
      <div class="flex items-center justify-between px-3 pt-4 pb-3">
        <span v-if="sidebarOpen" class="eduai-logo text-base">EduAI</span>
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="sidebar-toggle-btn w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
          :title="sidebarOpen ? 'Réduire' : 'Agrandir'"
        >
          <!-- Panel icon style DeepSeek -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 12h16M4 18h16"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 6v12"/>
          </svg>
        </button>
      </div>

      <!-- Nouvelle conversation -->
      <div :class="sidebarOpen ? 'px-3 pb-3' : 'px-2 pb-3 flex justify-center'">
        <button
          @click="chat.newConversation(); currentView = 'chat'; closeSidebarOnMobile()"
          :class="sidebarOpen
            ? 'w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm text-sm text-gray-700 transition font-medium shadow-sm'
            : 'w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-500 transition shadow-sm'"
          title="Nouvelle conversation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span v-if="sidebarOpen">Nouvelle conversation</span>
        </button>
      </div>

      <!-- Liste conversations groupées par date (sidebar ouverte) -->
      <template v-if="sidebarOpen">
        <div class="flex-1 overflow-y-auto px-2 pb-2">
          <div v-if="groupedConversations.length === 0" class="text-xs text-gray-400 px-3 py-6 text-center">
            Aucune conversation
          </div>
          <template v-for="group in groupedConversations" :key="group.label">
            <p class="text-[11px] font-medium text-gray-400 px-2 pt-4 pb-1.5 uppercase tracking-wide">{{ group.label }}</p>

            <div
              v-for="conv in group.items"
              :key="conv.id"
              class="relative group/conv mb-0.5"
            >
              <!-- Mode renommage : input inline -->
              <div v-if="renamingConvId === conv.id" class="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-blue-50">
                <input
                  :id="'rename-input-' + conv.id"
                  v-model="renameValue"
                  class="flex-1 text-[13px] text-blue-700 font-medium bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-500 py-0.5"
                  @keydown.enter.prevent="confirmRename(conv.id)"
                  @keydown.escape.prevent="cancelRename()"
                  @blur="confirmRename(conv.id)"
                  @click.stop
                />
                <button @click.stop="confirmRename(conv.id)" class="shrink-0 text-blue-500 hover:text-blue-700 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                </button>
              </div>

              <!-- Mode normal : ligne conversation -->
              <div
                v-else
                :class="[
                  'flex items-center gap-1.5 px-2.5 py-2.5 rounded-xl cursor-pointer transition-colors text-[13px]',
                  conv.id === chat.currentId
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                ]"
                @click="chat.switchConversation(conv.id); currentView = 'chat'; closeSidebarOnMobile(); convMenuId = null"
              >
                <span class="flex-1 truncate leading-snug">{{ conv.title }}</span>
                <!-- Bouton "···" -->
                <button
                  @click.stop="convMenuId = convMenuId === conv.id ? null : conv.id"
                  :class="[
                    'shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-all',
                    convMenuId === conv.id
                      ? 'opacity-100 bg-gray-200 text-gray-700'
                      : 'opacity-0 group-hover/conv:opacity-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700'
                  ]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
                  </svg>
                </button>
              </div>

              <!-- Dropdown options -->
              <Transition name="menu-up">
                <div
                  v-if="convMenuId === conv.id"
                  class="absolute right-1 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px]"
                >
                  <!-- Renommer -->
                  <button
                    @click.stop="startRename(conv)"
                    class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Renommer
                  </button>

                  <!-- Ouvrir dans le chat -->
                  <button
                    @click.stop="chat.switchConversation(conv.id); currentView = 'chat'; convMenuId = null; closeSidebarOnMobile()"
                    class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"/>
                    </svg>
                    Ouvrir
                  </button>

                  <!-- Exporter -->
                  <button
                    @click.stop="exportConversation(conv); convMenuId = null"
                    class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    Exporter
                  </button>

                  <div class="border-t border-gray-100 mt-1 pt-1">
                    <!-- Supprimer -->
                    <button
                      @click.stop="chat.deleteConversation(conv.id); convMenuId = null"
                      class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

          </template>
        </div>
      </template>
      <div v-else class="flex-1" />

      <!-- Profil utilisateur -->
      <div class="p-2 relative" ref="accountMenuRef">

        <!-- Dropdown (au-dessus) -->
        <Transition name="menu-up">
          <div v-if="showAccountMenu" class="absolute bottom-full left-2 right-2 mb-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
            <div class="px-3 py-2.5 border-b border-gray-100">
              <p class="text-[11px] text-gray-400 truncate">{{ auth.user?.email }}</p>
              <p class="text-sm font-semibold text-gray-900">{{ auth.user?.name }}</p>
              <p class="text-xs text-gray-500">{{ auth.user?.classe }}{{ auth.user?.serie !== 'sans' ? ' · ' + auth.user?.serie : '' }}</p>
            </div>
            <div class="py-1">
              <RouterLink to="/profile" @click="showAccountMenu = false" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Mon profil
              </RouterLink>
              <RouterLink v-if="auth.user?.role === 'admin'" to="/admin" @click="showAccountMenu = false" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Administration
              </RouterLink>
              <!-- Abonnement actuel -->
              <div class="flex items-center gap-2 px-3 py-2">
                <div :class="['w-4 h-4 shrink-0 rounded-full flex items-center justify-center', auth.user?.plan === 'premium' ? 'bg-amber-100' : 'bg-gray-100']">
                  <svg v-if="auth.user?.plan === 'premium'" xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <span class="text-xs text-gray-500">{{ auth.user?.plan === 'premium' ? 'Premium — messages illimités' : 'Gratuit — 10 messages/jour' }}</span>
              </div>

              <!-- Changer d'abonnement (free → upgrade / premium → gérer) -->
              <button
                @click="showAccountMenu = false; $router.push('/subscribe')"
                :class="['w-full flex items-center gap-2 px-3 py-2 text-sm transition font-medium', auth.user?.plan === 'premium' ? 'text-gray-700 hover:bg-gray-50' : 'text-blue-600 hover:bg-blue-50']"
              >
                <svg v-if="auth.user?.plan !== 'premium'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                </svg>
                {{ auth.user?.plan === 'premium' ? "Changer d'abonnement" : 'Passer en Premium' }}
              </button>
            </div>
            <div class="border-t border-gray-100 py-1">
              <button @click="handleLogout" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Se déconnecter
              </button>
            </div>
          </div>
        </Transition>

        <!-- Bouton profil (sidebar ouverte) -->
        <button
          v-if="sidebarOpen"
          @click="showAccountMenu = !showAccountMenu"
          :class="['w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all', showAccountMenu ? 'bg-gray-100 border-gray-200' : 'border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm']"
        >
          <!-- Avatar avec ring premium -->
          <div :class="['shrink-0 relative', auth.user?.plan === 'premium' ? 'p-[2px] rounded-full bg-gradient-to-br from-yellow-400 to-orange-400' : '']">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[11px] shadow-sm">
              {{ initials }}
            </div>
          </div>
          <!-- Infos -->
          <div class="flex-1 min-w-0 text-left">
            <p class="text-[13px] font-semibold text-gray-800 truncate leading-tight">{{ auth.user?.name }}</p>
            <span v-if="auth.user?.plan === 'premium'" class="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full leading-none mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Premium
            </span>
            <span v-else class="inline-flex items-center text-[10px] font-medium text-gray-400 leading-none mt-0.5">
              Gratuit
            </span>
          </div>
          <!-- Ellipsis -->
          <div class="shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01"/>
            </svg>
          </div>
        </button>

        <!-- Avatar seul (sidebar réduite) -->
        <button
          v-else
          @click="showAccountMenu = !showAccountMenu"
          :class="['flex items-center justify-center mx-auto rounded-xl border transition-all', auth.user?.plan === 'premium' ? 'p-[2px]' : 'p-1', showAccountMenu ? 'bg-gray-100 border-gray-200' : 'border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm']"
          :title="auth.user?.name"
        >
          <div :class="['rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[11px] shadow-sm', auth.user?.plan === 'premium' ? 'w-7 h-7 ring-2 ring-amber-400 ring-offset-1' : 'w-8 h-8']">
            {{ initials }}
          </div>
        </button>

      </div>
    </aside>

    <!-- ═══ CONTENU PRINCIPAL ═══ -->
    <div class="flex-1 flex flex-col min-w-0">

      <!-- Barre top mobile -->
      <div class="md:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white shrink-0">
        <button
          @click="sidebarOpen = true"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 12h16M4 18h16"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 6v12"/>
          </svg>
        </button>
        <span class="eduai-logo text-base">EduAI</span>
      </div>

      <!-- ═══ DISCUSSIONS ═══ -->
      <div v-if="currentView === 'discussions'" class="flex-1 overflow-y-auto">
        <div class="max-w-3xl mx-auto w-full px-4 md:px-6 py-5 md:py-8">

          <div class="flex items-center justify-between mb-5 md:mb-8">
            <h1 class="text-xl md:text-2xl font-bold text-gray-900">Discussions</h1>
            <button
              @click="createAndGoToConversation()"
              class="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Nouvelle conversation
            </button>
          </div>

          <div class="relative mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="discussionsSearch"
              placeholder="Rechercher dans vos conversations..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition"
            />
          </div>

          <p class="text-xs text-gray-400 mb-1 px-0.5">
            Vos conversations avec EduAI
            <button v-if="discussionsSearch" @click="discussionsSearch = ''" class="ml-1.5 text-blue-500 hover:underline">Effacer</button>
          </p>

          <div class="divide-y divide-gray-100">
            <div
              v-for="conv in filteredDiscussions"
              :key="conv.id"
              @click="openConversation(conv.id)"
              class="flex items-center py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 -mx-2 px-2 rounded-lg transition group"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ conv.title }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Dernier message {{ timeAgo(conv.updatedAt || conv.createdAt) }}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0 ml-3 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>

          <p v-if="filteredDiscussions.length === 0" class="text-sm text-gray-400 text-center py-12">
            {{ discussionsSearch ? `Aucun résultat pour "${discussionsSearch}"` : 'Aucune conversation' }}
          </p>

        </div>
      </div>

      <!-- ═══ CHAT ═══ -->
      <template v-else>

      <!-- ═══ ÉTAT VIDE — input centré ═══ -->
      <div
        v-if="chat.messages.length === 0"
        class="flex-1 flex flex-col items-center justify-center gap-4 px-4 pb-6"
      >
        <div class="text-center">
          <div class="text-3xl md:text-4xl mb-2">🎓</div>
          <h2 class="text-base md:text-lg font-semibold text-gray-800">
            {{ auth.user?.langue === 'en' ? 'Hello' : 'Bonjour' }}, {{ auth.user?.name }} !
          </h2>
          <p class="text-sm text-gray-400 mt-1 max-w-xs">
            {{ auth.user?.langue === 'en'
              ? 'Ask me anything about your courses.'
              : 'Pose-moi n\'importe quelle question sur tes cours.' }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2 justify-center max-w-lg">
          <button
            v-for="s in suggestions"
            :key="s"
            @click="sendSuggestion(s)"
            class="text-xs bg-gray-50 border border-gray-200 text-gray-600 rounded-full px-3 py-1.5 hover:bg-gray-100 transition"
          >
            {{ s }}
          </button>
        </div>

        <!-- Input centré -->
        <div class="w-full max-w-2xl px-0 md:px-0">
          <InputForm
            v-model:input="input"
            :disabled="chat.loading || chat.streaming"
            :langue="auth.user?.langue"
            :attached-files="attachedFiles"
            @send="handleSend"
            @file-select="handleFileSelect"
            @remove-file="removeFile($event)"
            @resize="autoResize"
            :textarea-ref="textareaEl"
            @textarea-ref="textareaEl = $event"
          />
        </div>
      </div>

      <!-- ═══ MESSAGES + input en bas ═══ -->
      <template v-else>
        <div ref="messagesEl" class="flex-1 overflow-y-auto">
          <div class="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-5">

            <div v-for="(msg, i) in chat.messages" :key="i">
              <div v-if="msg.role === 'user'" class="flex justify-end">
                <div
                  class="max-w-[88%] md:max-w-[72%] bg-gray-100 text-gray-800 rounded-2xl rounded-tr-md px-4 py-2.5 text-sm leading-relaxed"
                  v-html="formatMessage(msg.content, 'user')"
                />
              </div>
              <div v-else class="group/msg relative">
                <div
                  class="text-sm text-gray-800 dark:text-gray-200 leading-relaxed prose-message"
                  v-html="formatMessage(msg.content, 'assistant')"
                />
                <div class="flex items-center gap-1 mt-2 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-150">
                  <!-- Copier -->
                  <button
                    @click="copyMessage(msg.content, i)"
                    :title="copiedIdx === i ? 'Copié !' : 'Copier la réponse'"
                    class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <svg v-if="copiedIdx !== i" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span :class="copiedIdx === i ? 'text-green-500' : ''">{{ copiedIdx === i ? 'Copié' : 'Copier' }}</span>
                  </button>

                  <!-- Exporter PDF -->
                  <button
                    @click="exportMessagePDF(msg.content, i)"
                    title="Exporter en PDF"
                    class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    PDF
                  </button>

                  <!-- Exporter Word -->
                  <button
                    @click="exportMessageWord(msg.content, i)"
                    title="Exporter en Word"
                    class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Word
                  </button>
                </div>
              </div>
            </div>

            <!-- 3 points (avant 1er chunk) -->
            <div v-if="chat.loading" class="flex gap-1 items-center pt-1">
              <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style="animation-delay:0ms"/>
              <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style="animation-delay:150ms"/>
              <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style="animation-delay:300ms"/>
            </div>

            <!-- Curseur streaming -->
            <span v-if="chat.streaming" class="inline-block w-0.5 h-4 bg-gray-400 animate-pulse align-middle"/>

            <!-- Erreur -->
            <div v-if="chat.error" class="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              <span class="shrink-0">⚠</span>
              <span class="flex-1">{{ chat.error }}</span>
              <button @click="chat.error = null" class="shrink-0 text-red-400 hover:text-red-600 transition">✕</button>
            </div>

          </div>
        </div>

        <!-- Input en bas -->
        <div class="shrink-0 bg-white px-4 py-4">
          <div class="max-w-3xl mx-auto">
            <InputForm
              v-model:input="input"
              :disabled="chat.loading || chat.streaming"
              :langue="auth.user?.langue"
              :attached-files="attachedFiles"
              @send="handleSend"
              @file-select="handleFileSelect"
              @remove-file="removeFile($event)"
              @resize="autoResize"
              @textarea-ref="textareaEl = $event"
            />
          </div>
        </div>
      </template>

      </template>

    </div>

    <!-- ═══ MODALE RECHERCHE ═══ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="searchOpen"
          class="fixed inset-0 bg-black/30 z-50 flex items-start justify-center"
          style="padding-top: 14vh"
          @click.self="closeSearch()"
        >
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">

            <!-- Input recherche -->
            <div class="flex items-center gap-3 px-4 py-3.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="searchQuery"
                ref="searchInputRef"
                placeholder="Rechercher dans les discussions..."
                class="flex-1 text-sm outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100 bg-transparent"
                @keydown.escape="closeSearch()"
              />
              <kbd class="text-xs text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5 font-mono cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" @click="closeSearch()">Esc</kbd>
            </div>

            <!-- Résultats -->
            <div class="border-t border-gray-100 dark:border-gray-700 max-h-72 overflow-y-auto">
              <div
                v-for="conv in searchResults"
                :key="conv.id"
                @click="selectSearchResult(conv.id)"
                class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0 group-hover:text-gray-400 dark:group-hover:text-gray-400 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"/>
                </svg>
                <span class="flex-1 text-sm text-gray-700 dark:text-gray-200 truncate">{{ conv.title }}</span>
                <span class="text-xs text-gray-400 dark:text-gray-500 shrink-0">{{ timeAgo(conv.updatedAt || conv.createdAt) }}</span>
              </div>
              <p v-if="searchResults.length === 0" class="text-sm text-gray-400 dark:text-gray-500 text-center py-6 px-4">
                {{ searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Aucune conversation' }}
              </p>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store.js'
import { useChatStore } from '../stores/chat.store.js'
import { onClickOutside } from '@vueuse/core'
import { marked } from 'marked'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// Composant inline pour le formulaire d'envoi (évite la duplication de template)
import { defineComponent, h, resolveComponent } from 'vue'

const InputForm = defineComponent({
  name: 'InputForm',
  props: {
    input: String,
    disabled: Boolean,
    langue: String,
    attachedFiles: { type: Array, default: () => [] }
  },
  emits: ['update:input', 'send', 'fileSelect', 'removeFile', 'resize', 'textareaRef'],
  setup(props, { emit }) {
    const taRef = ref(null)
    onMounted(() => emit('textareaRef', taRef.value))

    function onKey(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        emit('send')
      }
    }

    const makeDocIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-6 h-6 text-gray-400 mb-1 shrink-0', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
    )

    return () => h('div', { class: 'flex flex-col gap-2' }, [

      // Grid preview des fichiers
      props.attachedFiles.length > 0
        ? h('div', { class: 'grid grid-cols-2 sm:grid-cols-4 gap-2 pb-1' },
            props.attachedFiles.map((f, i) =>
              h('div', { key: i, class: 'relative group/file' }, [
                f.isImage
                  ? h('img', { src: f.preview, alt: f.name, class: 'w-full h-20 object-cover rounded-xl border border-gray-200 bg-gray-100' })
                  : h('div', { class: 'w-full h-20 flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-2 overflow-hidden' }, [
                      makeDocIcon(),
                      h('span', { class: 'text-xs text-gray-500 text-center truncate w-full leading-tight', title: f.name }, f.name),
                      h('span', { class: 'text-xs text-gray-400 mt-0.5' }, f.size < 1024 ? f.size + ' o' : f.size < 1048576 ? Math.round(f.size / 1024) + ' Ko' : Math.round(f.size / 1048576) + ' Mo')
                    ]),
                h('button', {
                  type: 'button',
                  onClick: () => emit('removeFile', i),
                  class: 'absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover/file:opacity-100 transition-all shadow'
                }, '×')
              ])
            )
          )
        : null,

      // Zone de saisie style DeepSeek
      h('div', { class: 'bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-shadow focus-within:shadow-md focus-within:border-gray-300' }, [

        // Textarea
        h('div', { class: 'px-4 pt-3.5 pb-1' }, [
          h('textarea', {
            ref: taRef,
            value: props.input,
            placeholder: props.langue === 'en' ? 'Message EduAI...' : 'Envoie un message à EduAI...',
            rows: 1,
            disabled: props.disabled,
            class: 'w-full text-sm resize-none focus:outline-none disabled:opacity-50 bg-transparent placeholder-gray-400 text-gray-800 leading-relaxed',
            style: 'max-height:160px',
            onInput: (e) => { emit('update:input', e.target.value); emit('resize', e) },
            onKeydown: onKey
          })
        ]),

        // Barre d'actions bas
        h('div', { class: 'flex items-center justify-between px-3 pb-3 pt-1' }, [

          // Gauche : bouton fichier (style pill)
          h('label', {
            class: 'flex items-center gap-1.5 cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition px-2.5 py-1.5 rounded-full text-xs font-medium file-attach-btn',
            title: 'Joindre des fichiers'
          }, [
            h('input', {
              type: 'file',
              class: 'hidden',
              accept: '.txt,.md,.csv,.pdf,.png,.jpg,.jpeg,.gif,.webp',
              multiple: true,
              onChange: (e) => emit('fileSelect', e)
            }),
            h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' })
            ),
            'Fichiers'
          ]),

          // Droite : bouton envoi (cercle bleu, flèche haut)
          h('button', {
            type: 'button',
            disabled: props.disabled || (!props.input?.trim() && props.attachedFiles.length === 0),
            onClick: () => emit('send'),
            class: 'w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white transition-colors'
          }, [
            h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2.5', d: 'M5 12h14M12 5l7 7-7 7' })
            )
          ])
        ])
      ])
    ])
  }
})

const router = useRouter()
const auth = useAuthStore()
const chat = useChatStore()

const input = ref('')
const messagesEl = ref(null)
const textareaEl = ref(null)
const sidebarOpen = ref(window.innerWidth >= 768)
const attachedFiles = ref([])
const showAccountMenu = ref(false)
const accountMenuRef = ref(null)
const currentView = ref('chat')
const copiedIdx = ref(null)
const convMenuId = ref(null)
const renamingConvId = ref(null)
const renameValue = ref('')
const searchOpen = ref(false)
const searchQuery = ref('')
const discussionsSearch = ref('')
const searchInputRef = ref(null)

onClickOutside(accountMenuRef, () => { showAccountMenu.value = false })

marked.use({ breaks: true, gfm: true })

const initials = computed(() =>
  (auth.user?.name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
)

const suggestions = computed(() =>
  auth.user?.langue === 'en'
    ? ['Explain derivatives to me', 'Give me maths exercises', 'Summarize the Cold War', 'What is photosynthesis?']
    : ['Explique-moi les dérivées', 'Donne-moi des exercices de maths', 'Résume la guerre froide', "C'est quoi la photosynthèse ?"]
)

async function handleSend() {
  let content = input.value.trim()
  if (!content && attachedFiles.value.length === 0) return

  if (attachedFiles.value.length > 0) {
    const parts = attachedFiles.value.map(f => {
      const header = `[Fichier joint : ${f.name}]`
      return f.content
        ? `${header}\n\`\`\`\n${f.content}\n\`\`\``
        : header
    })
    content = parts.join('\n') + (content ? '\n\n' + content : '')
  }

  input.value = ''
  attachedFiles.value.forEach(f => { if (f.preview) URL.revokeObjectURL(f.preview) })
  attachedFiles.value = []
  if (textareaEl.value) textareaEl.value.style.height = 'auto'
  const userId = (auth.user?.id || auth.user?._id)?.toString()
  await chat.sendMessage(userId, content)
}

async function sendSuggestion(text) {
  input.value = text
  await handleSend()
}

async function handleFileSelect(event) {
  const files = Array.from(event.target.files || [])
  event.target.value = ''
  if (!files.length) return
  try {
    const newEntries = await Promise.all(files.map(async (file) => {
      const isImage = file.type.startsWith('image/')
      const isText = file.type.startsWith('text/') || /\.(txt|md|csv)$/i.test(file.name)
      let content = null
      if (isText) {
        try { content = (await file.text()).slice(0, 6000) } catch { content = null }
      }
      return {
        file,
        name: file.name,
        size: file.size,
        isImage,
        isText,
        preview: isImage ? URL.createObjectURL(file) : null,
        content
      }
    }))
    attachedFiles.value = [...attachedFiles.value, ...newEntries]
  } catch (err) {
    console.error('Erreur lecture fichiers:', err)
  }
}

function removeFile(index) {
  const f = attachedFiles.value[index]
  if (f?.preview) URL.revokeObjectURL(f.preview)
  attachedFiles.value = attachedFiles.value.filter((_, i) => i !== index)
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

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'à l\'instant'
  if (mins < 60) return `il y a ${mins} min`
  if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`
  if (days === 1) return 'hier'
  if (days < 30) return `il y a ${days} jour${days > 1 ? 's' : ''}`
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const searchResults = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return chat.conversations.slice(0, 8)
  return chat.conversations.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.messages.some(m => m.content?.toLowerCase().includes(q))
  ).slice(0, 8)
})

const groupedConversations = computed(() => {
  const now = Date.now()
  const groups = []
  const today = [], yesterday = [], last7 = [], last30 = [], monthly = {}
  for (const conv of chat.conversations) {
    const d = new Date(conv.updatedAt || conv.createdAt)
    const days = (now - d.getTime()) / 86400000
    if (days < 1) today.push(conv)
    else if (days < 2) yesterday.push(conv)
    else if (days < 7) last7.push(conv)
    else if (days < 30) last30.push(conv)
    else {
      const key = d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
      if (!monthly[key]) monthly[key] = []
      monthly[key].push(conv)
    }
  }
  if (today.length) groups.push({ label: "Aujourd'hui", items: today })
  if (yesterday.length) groups.push({ label: 'Hier', items: yesterday })
  if (last7.length) groups.push({ label: '7 derniers jours', items: last7 })
  if (last30.length) groups.push({ label: '30 derniers jours', items: last30 })
  for (const [key, items] of Object.entries(monthly)) groups.push({ label: key, items })
  return groups
})

const filteredDiscussions = computed(() => {
  const q = discussionsSearch.value.trim().toLowerCase()
  if (!q) return chat.conversations
  return chat.conversations.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.messages.some(m => m.content?.toLowerCase().includes(q))
  )
})

function openConversation(id) {
  chat.switchConversation(id)
  currentView.value = 'chat'
  if (window.innerWidth < 768) sidebarOpen.value = false
}

function closeSidebarOnMobile() {
  if (window.innerWidth < 768) sidebarOpen.value = false
}

function startRename(conv) {
  renamingConvId.value = conv.id
  renameValue.value = conv.title
  convMenuId.value = null
  nextTick(() => document.getElementById('rename-input-' + conv.id)?.select())
}

function confirmRename(id) {
  chat.renameConversation(id, renameValue.value)
  renamingConvId.value = null
  renameValue.value = ''
}

function cancelRename() {
  renamingConvId.value = null
  renameValue.value = ''
}

function exportConversation(conv) {
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const lines = conv.messages.map(m =>
    `## ${m.role === 'user' ? 'Vous' : 'EduAI'}\n\n${m.content}`
  ).join('\n\n---\n\n')
  const md = `# ${conv.title}\n\n*Exporté le ${date}*\n\n---\n\n${lines}`
  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${conv.title.slice(0, 40).replace(/[^a-z0-9]/gi, '_')}.md`
  a.click()
  URL.revokeObjectURL(url)
}

function closeSearch() {
  searchOpen.value = false
  searchQuery.value = ''
}

function selectSearchResult(id) {
  openConversation(id)
  closeSearch()
}

function stripMarkdown(content) {
  return content
    .replace(/\$\$([\s\S]+?)\$\$/g, '$1')
    .replace(/\$([^\$\n]+?)\$/g, '$1')
    .replace(/```(?:\w+)?\n?([\s\S]*?)```/gm, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/!\[[^\]]*\]\([^\)]+\)/g, '')
    .replace(/^>\s*/gm, '')
    .replace(/^[-*_]{3,}$/gm, '')
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    .trim()
}

async function copyMessage(content, idx) {
  try {
    await navigator.clipboard.writeText(stripMarkdown(content))
    copiedIdx.value = idx
    setTimeout(() => { copiedIdx.value = null }, 2000)
  } catch {
    // clipboard non disponible (HTTP sans HTTPS)
  }
}

function createAndGoToConversation() {
  chat.newConversation()
  currentView.value = 'chat'
}

function handleGlobalKey(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    searchOpen.value = true
  }
}

function handleGlobalClick() {
  convMenuId.value = null
}

watch(searchOpen, async (val) => {
  if (val) {
    await nextTick()
    searchInputRef.value?.focus()
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKey)
  window.addEventListener('click', handleGlobalClick)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKey)
  window.removeEventListener('click', handleGlobalClick)
})

function buildMessageExportHTML(content, autoPrint = false) {
  const rendered = formatMessage(content, 'assistant')
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Réponse EduAI</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    body{font-family:Georgia,serif;max-width:740px;margin:40px auto;padding:0 24px;color:#1a1a1a;line-height:1.75;font-size:14px}
    .meta{font-size:.75rem;color:#9ca3af;margin-bottom:28px;border-bottom:1px solid #e5e7eb;padding-bottom:10px}
    .meta strong{color:#059669}
    pre{background:#f8f9fa;border-radius:6px;padding:10px 14px;overflow-x:auto;font-size:.82rem}
    code{font-family:'Courier New',monospace;font-size:.85em}
    table{width:100%;border-collapse:collapse;margin:10px 0}
    th,td{border:1px solid #e5e7eb;padding:6px 10px;text-align:left;font-size:.88rem}
    th{background:#f9fafb;font-weight:600}
    blockquote{border-left:3px solid #e5e7eb;margin:0;padding-left:14px;color:#6b7280}
    @media print{body{margin:0}}
  </style>
  ${autoPrint ? `<script>window.onload=()=>{window.print()}<\/script>` : ''}
</head>
<body>
  <p class="meta"><strong>EduAI</strong> · ${date}</p>
  ${rendered}
</body>
</html>`
}

function exportMessagePDF(content) {
  const win = window.open('', '_blank')
  win.document.write(buildMessageExportHTML(content, true))
  win.document.close()
}

function exportMessageWord(content, idx) {
  const html = buildMessageExportHTML(content, false)
  const blob = new Blob(['﻿' + html], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `eduai_reponse_${idx + 1}.doc`
  a.click()
  URL.revokeObjectURL(url)
}

function isNearBottom() {
  if (!messagesEl.value) return true
  const { scrollTop, scrollHeight, clientHeight } = messagesEl.value
  return scrollHeight - scrollTop - clientHeight < 120
}

const formatCache = new Map()

function formatMessage(text, role = 'assistant') {
  if (!text) return ''
  const key = `${role}:${text}`
  if (formatCache.has(key)) return formatCache.get(key)

  let result
  if (role === 'user') {
    result = text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
  } else {
    const mathBlocks = []
    const protect = (formula, display) => {
      const i = mathBlocks.length
      try { mathBlocks.push(katex.renderToString(formula.trim(), { displayMode: display, throwOnError: false })) }
      catch { mathBlocks.push(`<code>${formula}</code>`) }
      return `KATEXPH${i}END`
    }
    let safe = text
      .replace(/\\\[([\s\S]*?)\\\]/g, (_, f) => protect(f, true))
      .replace(/\\\(([\s\S]*?)\\\)/g, (_, f) => protect(f, false))
    let html = marked.parse(safe)
    mathBlocks.forEach((r, i) => { html = html.replaceAll(`KATEXPH${i}END`, r) })
    html = html.replace(/<table>/g, '<div class="table-scroll"><table>').replace(/<\/table>/g, '</table></div>')
    result = html
  }

  // Limite la taille du cache
  if (formatCache.size > 200) formatCache.delete(formatCache.keys().next().value)
  formatCache.set(key, result)
  return result
}

// Vide le cache formatMessage quand on change de conversation
watch(() => chat.currentId, () => formatCache.clear())

watch(() => chat.messages.length, async () => {
  const near = isNearBottom()
  await nextTick()
  if (near && messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
})

watch(
  () => chat.messages[chat.messages.length - 1]?.content,
  async () => {
    if (!chat.streaming || !isNearBottom()) return
    await nextTick()
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
)
</script>

<style scoped>
.eduai-logo {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.2rem;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  user-select: none;
}

.prose-message :deep(h1),
.prose-message :deep(h2),
.prose-message :deep(h3),
.prose-message :deep(h4) {
  font-weight: 700; color: #111827;
  margin-top: 1.1rem; margin-bottom: 0.3rem; line-height: 1.35;
}
.prose-message :deep(h2) { font-size: 1rem; }
.prose-message :deep(h3) { font-size: 0.95rem; }
.prose-message :deep(h4) { font-size: 0.9rem; color: #374151; }

.prose-message :deep(p) { margin: 0.4rem 0; }
.prose-message :deep(p:first-child) { margin-top: 0; }
.prose-message :deep(p:last-child)  { margin-bottom: 0; }

.prose-message :deep(ul), .prose-message :deep(ol) { padding-left: 1.3rem; margin: 0.4rem 0; }
.prose-message :deep(li)  { margin: 0.15rem 0; }
.prose-message :deep(ul)  { list-style-type: disc; }
.prose-message :deep(ol)  { list-style-type: decimal; }

.prose-message :deep(hr) { border: none; border-top: 1px solid #f3f4f6; margin: 0.75rem 0; }

.prose-message :deep(code) {
  background: #f3f4f6; padding: 0.1rem 0.3rem; border-radius: 4px;
  font-size: 0.8em; font-family: ui-monospace, monospace; color: #111827;
}
.prose-message :deep(pre) {
  background: #1e293b; color: #e2e8f0; padding: 0.85rem 1rem;
  border-radius: 10px; overflow-x: auto; margin: 0.6rem 0; font-size: 0.8em;
}
.prose-message :deep(pre code) { background: transparent; padding: 0; color: inherit; font-size: inherit; }

.prose-message :deep(blockquote) {
  border-left: 3px solid #d1d5db; padding-left: 0.75rem;
  color: #6b7280; margin: 0.5rem 0; font-style: italic;
}
.prose-message :deep(strong) { font-weight: 600; }
.prose-message :deep(em)     { font-style: italic; }
.prose-message :deep(.katex-display) { overflow-x: auto; margin: 0.6rem 0; }

/* Tables */
.prose-message :deep(.table-scroll) {
  overflow-x: auto;
  margin: 0.75rem 0;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
.prose-message :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}
.prose-message :deep(thead) {
  background: #f3f4f6;
}
.prose-message :deep(th) {
  padding: 0.5rem 0.9rem;
  text-align: left;
  font-weight: 600;
  color: #111827;
  border-bottom: 2px solid #d1d5db;
  border-right: 1px solid #e5e7eb;
  white-space: nowrap;
}
.prose-message :deep(th:last-child) { border-right: none; }
.prose-message :deep(td) {
  padding: 0.45rem 0.9rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  vertical-align: top;
  line-height: 1.5;
}
.prose-message :deep(td:last-child) { border-right: none; }
.prose-message :deep(tr:last-child td) { border-bottom: none; }
.prose-message :deep(tbody tr:nth-child(even)) { background: #fafafa; }
.prose-message :deep(tbody tr:hover) { background: #f3f4f6; transition: background 0.1s; }

/* Transition menu compte */
.menu-up-enter-active,
.menu-up-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.menu-up-enter-from,
.menu-up-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* Sidebar icon animations */
.sidebar-toggle-btn svg,
.sidebar-toggle-btn { transition: transform 0.2s ease, color 0.15s; }
.sidebar-toggle-btn:hover svg { transform: scale(1.15); }

/* Nav items: icon scale + slight color pop on hover */
aside button svg,
aside a svg { transition: transform 0.18s ease, color 0.15s; }
aside button:hover svg,
aside a:hover svg { transform: scale(1.18); }

/* New conversation (+) rotates 90° on hover */
aside div > button:has(svg path[d*="M12 4v16"]):hover svg,
aside button[title="Nouvelle conversation"]:hover svg {
  transform: rotate(90deg) scale(1.1);
}

/* Transition modale recherche */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.15s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .bg-white,
.modal-fade-leave-active .bg-white {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.modal-fade-enter-from .bg-white,
.modal-fade-leave-to .bg-white {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
