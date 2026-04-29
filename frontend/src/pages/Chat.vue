<template>
  <div class="flex h-screen bg-white dark:bg-gray-950 overflow-hidden">

    <!-- ═══ SIDEBAR ═══ -->
    <aside
      :class="[
        'flex flex-col shrink-0 bg-gray-50 dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-200 overflow-hidden',
        sidebarOpen ? 'w-64' : 'w-0'
      ]"
    >
      <!-- Logo + theme toggle + hamburger -->
      <div class="flex items-center justify-between px-3 pt-4 pb-2">
        <span class="eduai-logo">EduAI</span>
        <div class="flex items-center gap-0.5">
          <button
            @click="toggleTheme()"
            class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            :title="isDark ? 'Mode clair' : 'Mode sombre'"
          >
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Fermer le menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Nouvelle conversation -->
      <div class="px-3 pb-2">
        <button
          @click="chat.newConversation(); currentView = 'chat'"
          class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nouvelle conversation
        </button>
      </div>

      <!-- Nav items -->
      <div class="px-2 pb-1 flex flex-col gap-0.5">
        <button
          @click="searchOpen = true"
          class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          Rechercher
        </button>
        <button
          @click="currentView = 'discussions'"
          :class="['flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition w-full',
            currentView === 'discussions'
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200']"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"/>
          </svg>
          Discussions
        </button>
      </div>

      <!-- Récents label -->
      <p v-if="chat.conversations.length > 0" class="text-xs text-gray-400 dark:text-gray-500 px-4 pt-2 pb-1">Récents</p>

      <!-- Liste des conversations -->
      <div class="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        <div
          v-for="conv in chat.conversations"
          :key="conv.id"
          :class="[
            'group flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition text-sm',
            conv.id === chat.currentId
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
          ]"
          @click="chat.switchConversation(conv.id); currentView = 'chat'"
        >
          <span class="flex-1 truncate">{{ conv.title }}</span>
          <button
            @click.stop="chat.deleteConversation(conv.id)"
            class="shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition p-0.5 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <p v-if="chat.conversations.length === 0" class="text-xs text-gray-400 px-3 py-4 text-center">
          Aucune conversation
        </p>
      </div>

      <!-- Profil utilisateur + menu -->
      <div class="p-3 border-t border-gray-100 dark:border-gray-800 relative" ref="accountMenuRef">

        <!-- Dropdown (apparaît au-dessus) -->
        <Transition name="menu-up">
          <div v-if="showAccountMenu" class="absolute bottom-full left-0 right-0 mb-2 mx-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">

            <!-- En-tête compte -->
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
              <p class="text-xs text-gray-400 dark:text-gray-500 truncate">{{ auth.user?.email }}</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{{ auth.user?.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {{ auth.user?.classe }}{{ auth.user?.serie !== 'sans' ? ' · ' + auth.user?.serie : '' }}
              </p>
            </div>

            <!-- Navigation -->
            <div class="py-1">
              <RouterLink
                to="/profile"
                @click="showAccountMenu = false"
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Mon profil
              </RouterLink>
            </div>

            <!-- Plan -->
            <div class="border-t border-gray-100 dark:border-gray-700 py-1">
              <div class="px-4 py-2 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-300">
                  {{ auth.user?.plan === 'premium' ? 'Premium — Messages illimités' : 'Gratuit — 10 messages / jour' }}
                </span>
              </div>
              <button
                v-if="auth.user?.plan !== 'premium'"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
                Passer en Premium
              </button>
            </div>

            <!-- Déconnexion -->
            <div class="border-t border-gray-100 dark:border-gray-700 py-1">
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Se déconnecter
              </button>
            </div>

          </div>
        </Transition>

        <!-- Bouton profil -->
        <button
          @click="showAccountMenu = !showAccountMenu"
          :class="['w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition', showAccountMenu ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700']"
        >
          <div class="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xs shrink-0">
            {{ initials }}
          </div>
          <div class="flex-1 min-w-0 text-left">
            <p class="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-400 dark:text-gray-500">{{ auth.user?.plan === 'premium' ? '⭐ Premium' : 'Gratuit' }}</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200"
            :class="showAccountMenu ? '' : 'rotate-180'"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
          </svg>
        </button>

      </div>
    </aside>

    <!-- ═══ CONTENU PRINCIPAL ═══ -->
    <div class="flex-1 flex flex-col min-w-0">

      <!-- Bouton ouvrir sidebar (visible uniquement quand fermé) -->
      <div v-if="!sidebarOpen" class="shrink-0 px-3 pt-3 pb-1 flex items-center gap-3">
        <button
          @click="sidebarOpen = true"
          class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Ouvrir le menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <span class="eduai-logo">EduAI</span>
      </div>

      <!-- ═══ DISCUSSIONS ═══ -->
      <div v-if="currentView === 'discussions'" class="flex-1 overflow-y-auto">
        <div class="max-w-3xl mx-auto w-full px-6 py-8">

          <div class="flex items-center justify-between mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Discussions</h1>
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
        class="flex-1 flex flex-col items-center justify-center gap-5 px-4 pb-8"
      >
        <div class="text-center">
          <div class="text-4xl mb-3">🎓</div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ auth.user?.langue === 'en' ? 'Hello' : 'Bonjour' }}, {{ auth.user?.name }} !
          </h2>
          <p class="text-sm text-gray-400 mt-1 max-w-xs">
            {{ auth.user?.langue === 'en'
              ? 'Ask me anything about your courses.'
              : 'Pose-moi n\'importe quelle question sur tes cours.' }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="s in suggestions"
            :key="s"
            @click="sendSuggestion(s)"
            class="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {{ s }}
          </button>
        </div>

        <!-- Input centré -->
        <div class="w-full max-w-2xl">
          <InputForm
            v-model:input="input"
            :disabled="chat.loading || chat.streaming"
            :langue="auth.user?.langue"
            :attached-file="attachedFile"
            @send="handleSend"
            @file-select="handleFileSelect"
            @remove-file="removeFile"
            @resize="autoResize"
            :textarea-ref="textareaEl"
            @textarea-ref="textareaEl = $event"
          />
        </div>
      </div>

      <!-- ═══ MESSAGES + input en bas ═══ -->
      <template v-else>
        <div ref="messagesEl" class="flex-1 overflow-y-auto">
          <div class="max-w-3xl mx-auto px-6 py-6 space-y-5">

            <div v-for="(msg, i) in chat.messages" :key="i">
              <div v-if="msg.role === 'user'" class="flex justify-end">
                <div
                  class="max-w-[72%] bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tr-md px-4 py-2.5 text-sm leading-relaxed"
                  v-html="formatMessage(msg.content, 'user')"
                />
              </div>
              <div
                v-else
                class="text-sm text-gray-800 dark:text-gray-200 leading-relaxed prose-message"
                v-html="formatMessage(msg.content, 'assistant')"
              />
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
        <div class="shrink-0 border-t border-gray-100 dark:border-gray-800 px-4 py-4">
          <div class="max-w-3xl mx-auto">
            <InputForm
              v-model:input="input"
              :disabled="chat.loading || chat.streaming"
              :langue="auth.user?.langue"
              :attached-file="attachedFile"
              @send="handleSend"
              @file-select="handleFileSelect"
              @remove-file="removeFile"
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
    attachedFile: Object
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

    return () => h('div', { class: 'flex flex-col gap-2' }, [
      // Fichier attaché
      props.attachedFile
        ? h('div', { class: 'flex items-center gap-2 text-xs bg-blue-50 border border-blue-100 text-blue-700 rounded-xl px-3 py-1.5' }, [
            h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-3.5 h-3.5 shrink-0', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' })
            ),
            h('span', { class: 'flex-1 truncate' }, props.attachedFile.name),
            h('button', { type: 'button', onClick: () => emit('removeFile'), class: 'text-blue-400 hover:text-blue-600' }, '✕')
          ])
        : null,
      // Zone de saisie
      h('div', { class: 'flex items-end gap-2 border border-gray-200 dark:border-gray-700 rounded-2xl px-3 py-2.5 focus-within:border-gray-400 dark:focus-within:border-gray-500 transition-colors bg-white dark:bg-gray-800 shadow-sm' }, [
        // Bouton fichier
        h('label', { class: 'shrink-0 cursor-pointer text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition mb-0.5', title: 'Joindre un fichier' }, [
          h('input', {
            type: 'file',
            class: 'hidden',
            accept: '.txt,.md,.pdf,.png,.jpg,.jpeg',
            onChange: (e) => emit('fileSelect', e)
          }),
          h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
            h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' })
          )
        ]),
        // Textarea
        h('textarea', {
          ref: taRef,
          value: props.input,
          placeholder: props.langue === 'en' ? 'Ask your question here...' : 'Pose ta question ici...',
          rows: 1,
          disabled: props.disabled,
          class: 'flex-1 text-sm resize-none focus:outline-none disabled:opacity-50 bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100 py-0.5',
          style: 'max-height:120px',
          onInput: (e) => { emit('update:input', e.target.value); emit('resize', e) },
          onKeydown: onKey
        }),
        // Bouton envoi (icône flèche)
        h('button', {
          type: 'button',
          disabled: props.disabled || !props.input?.trim(),
          onClick: () => emit('send'),
          class: 'shrink-0 mb-0.5 w-8 h-8 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white transition'
        }, [
          h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
            h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2.5', d: 'M5 12h14M12 5l7 7-7 7' })
          )
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
const sidebarOpen = ref(true)
const attachedFile = ref(null)
const fileContent = ref(null)
const showAccountMenu = ref(false)
const accountMenuRef = ref(null)
const currentView = ref('chat')
const isDark = ref(document.documentElement.classList.contains('dark'))
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
  if (!content && !attachedFile.value) return

  if (attachedFile.value) {
    const header = `[Fichier joint : ${attachedFile.value.name}]`
    content = fileContent.value
      ? `${header}\n\`\`\`\n${fileContent.value}\n\`\`\`\n\n${content}`
      : `${header}\n\n${content}`
  }

  input.value = ''
  attachedFile.value = null
  fileContent.value = null
  if (textareaEl.value) textareaEl.value.style.height = 'auto'
  const userId = (auth.user?.id || auth.user?._id)?.toString()
  await chat.sendMessage(userId, content)
}

async function sendSuggestion(text) {
  input.value = text
  await handleSend()
}

async function handleFileSelect(event) {
  const file = event.target.files?.[0]
  if (!file) return
  attachedFile.value = file
  const isText = file.type.startsWith('text/') || /\.(txt|md|csv)$/i.test(file.name)
  if (isText) {
    fileContent.value = (await file.text()).slice(0, 6000)
  } else {
    fileContent.value = null
  }
  event.target.value = ''
}

function removeFile() {
  attachedFile.value = null
  fileContent.value = null
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
}

function closeSearch() {
  searchOpen.value = false
  searchQuery.value = ''
}

function selectSearchResult(id) {
  openConversation(id)
  closeSearch()
}

function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('eduai_theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('eduai_theme', 'light')
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

watch(searchOpen, async (val) => {
  if (val) {
    await nextTick()
    searchInputRef.value?.focus()
  }
})

onMounted(() => window.addEventListener('keydown', handleGlobalKey))
onUnmounted(() => window.removeEventListener('keydown', handleGlobalKey))

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

/* Dark mode — overrides prose */
:global(.dark) .prose-message :deep(h1),
:global(.dark) .prose-message :deep(h2),
:global(.dark) .prose-message :deep(h3),
:global(.dark) .prose-message :deep(h4) { color: #f3f4f6; }

:global(.dark) .prose-message :deep(code) {
  background: #374151; color: #e5e7eb;
}
:global(.dark) .prose-message :deep(blockquote) {
  border-color: #4b5563; color: #9ca3af;
}
:global(.dark) .prose-message :deep(hr) { border-color: #374151; }

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
