<template>
  <div class="min-h-screen bg-white font-sans">

    <!-- ═══ NAVBAR ═══ -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <span class="eduai-logo text-xl">EduAI</span>
        <div class="hidden sm:flex items-center gap-6 text-sm text-gray-600">
          <a href="#features" class="hover:text-gray-900 transition">Fonctionnalités</a>
          <a href="#how" class="hover:text-gray-900 transition">Comment ça marche</a>
          <a href="#pricing" class="hover:text-gray-900 transition">Tarifs</a>
        </div>
        <div class="flex items-center gap-2">
          <RouterLink to="/login" class="text-sm text-gray-600 hover:text-gray-900 transition px-3 py-1.5">
            Connexion
          </RouterLink>
          <RouterLink to="/register" class="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition shadow-sm">
            Commencer gratuitement
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- ═══ HERO ═══ -->
    <section class="pt-32 pb-20 px-4 sm:px-6 text-center relative overflow-hidden">
      <!-- Gradient de fond -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-blue-50 via-indigo-50 to-white rounded-full blur-3xl opacity-70"></div>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-blue-100">
          <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
          Adapté au programme MINESEC Cameroun
        </div>

        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Ton professeur IA<br>
          <span class="hero-gradient">disponible 24h/24</span>
        </h1>

        <p class="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          EduAI t'accompagne dans toutes tes matières — maths, sciences, histoire, langues — en s'adaptant à ta classe et ta série, du collège à la terminale.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <RouterLink to="/register" class="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition shadow-lg shadow-blue-200 text-base">
            Commencer gratuitement
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </RouterLink>
          <RouterLink to="/login" class="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl transition border border-gray-200 text-base">
            J'ai déjà un compte
          </RouterLink>
        </div>

        <!-- Preview chat -->
        <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden text-left">
          <div class="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div class="w-3 h-3 rounded-full bg-red-300"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-300"></div>
            <div class="w-3 h-3 rounded-full bg-green-300"></div>
            <span class="text-xs text-gray-400 ml-2">EduAI — Terminale C</span>
          </div>
          <div class="p-5 space-y-4">
            <div class="flex justify-end">
              <div class="bg-gray-100 text-gray-800 rounded-2xl rounded-tr-md px-4 py-2.5 text-sm max-w-xs">
                Explique-moi le théorème de Pythagore avec un exercice
              </div>
            </div>
            <div class="text-sm text-gray-700 leading-relaxed space-y-2">
              <p class="font-semibold text-gray-900">Théorème de Pythagore</p>
              <p>Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés :</p>
              <div class="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 font-mono text-blue-700 text-center text-base">
                a² + b² = c²
              </div>
              <p class="text-gray-600 text-xs">Exercice : Un triangle a les côtés a = 3 cm et b = 4 cm. Calcule c…</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ STATS ═══ -->
    <section class="py-12 bg-gray-50 border-y border-gray-100">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div v-for="s in stats" :key="s.label">
          <p class="text-3xl font-extrabold text-blue-600 mb-1">{{ s.value }}</p>
          <p class="text-sm text-gray-500">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- ═══ FEATURES ═══ -->
    <section id="features" class="py-20 px-4 sm:px-6">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-14">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Tout ce dont tu as besoin</h2>
          <p class="text-gray-500 max-w-xl mx-auto">Un tuteur IA qui comprend le contexte scolaire camerounais et s'adapte à toi.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="f in features" :key="f.title" class="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-gray-200 transition-all group">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4" :class="f.bg">
              {{ f.icon }}
            </div>
            <h3 class="font-bold text-gray-900 mb-2">{{ f.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ COMMENT ÇA MARCHE ═══ -->
    <section id="how" class="py-20 px-4 sm:px-6 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-14">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Prêt en 3 étapes</h2>
          <p class="text-gray-500">Commence à apprendre en moins de 2 minutes.</p>
        </div>
        <div class="grid sm:grid-cols-3 gap-8 relative">
          <div class="hidden sm:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 z-0"></div>
          <div v-for="(step, i) in steps" :key="i" class="text-center relative z-10">
            <div class="w-16 h-16 rounded-full bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200">
              {{ i + 1 }}
            </div>
            <h3 class="font-bold text-gray-900 mb-2">{{ step.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ TARIFS ═══ -->
    <section id="pricing" class="py-20 px-4 sm:px-6">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-10">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Tarifs simples</h2>
          <p class="text-gray-500">Commence gratuitement, passe en Premium quand tu veux.</p>
        </div>

        <!-- Toggle mensuel / annuel -->
        <div class="flex items-center justify-center gap-3 mb-10">
          <span :class="['text-sm font-medium transition', !billingAnnual ? 'text-gray-900' : 'text-gray-400']">Mensuel</span>
          <button
            @click="billingAnnual = !billingAnnual"
            :class="['relative w-12 h-6 rounded-full transition-colors focus:outline-none', billingAnnual ? 'bg-blue-600' : 'bg-gray-200']"
          >
            <span :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', billingAnnual ? 'translate-x-6' : 'translate-x-0']" />
          </button>
          <span :class="['text-sm font-medium transition', billingAnnual ? 'text-gray-900' : 'text-gray-400']">
            Annuel
          </span>
          <span class="bg-green-100 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded-full">2 mois offerts</span>
        </div>

        <div class="grid sm:grid-cols-2 gap-6">

          <!-- Gratuit -->
          <div class="bg-white border border-gray-200 rounded-2xl p-8">
            <p class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Gratuit</p>
            <p class="text-4xl font-extrabold text-gray-900 mb-1">0 <span class="text-lg font-medium text-gray-400">FCFA</span></p>
            <p class="text-sm text-gray-400 mb-6">Pour toujours</p>
            <ul class="space-y-3 mb-8">
              <li v-for="f in freeFeatures" :key="f" class="flex items-center gap-2.5 text-sm text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                {{ f }}
              </li>
            </ul>
            <RouterLink to="/register" class="block w-full text-center px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition text-sm">
              Commencer gratuitement
            </RouterLink>
          </div>

          <!-- Premium -->
          <div class="bg-blue-600 rounded-2xl p-8 relative overflow-hidden shadow-xl shadow-blue-200">
            <div class="absolute top-4 right-4 bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              POPULAIRE
            </div>
            <p class="text-sm font-semibold text-blue-100 uppercase tracking-wide mb-2">Premium</p>

            <!-- Prix mensuel -->
            <template v-if="!billingAnnual">
              <p class="text-4xl font-extrabold text-white mb-1">2 500 <span class="text-lg font-medium text-blue-200">FCFA</span></p>
              <p class="text-sm text-blue-200 mb-6">par mois</p>
            </template>

            <!-- Prix annuel -->
            <template v-else>
              <div class="flex items-baseline gap-2 mb-1">
                <p class="text-4xl font-extrabold text-white">25 000 <span class="text-lg font-medium text-blue-200">FCFA</span></p>
              </div>
              <div class="flex items-center gap-2 mb-6">
                <p class="text-sm text-blue-200">par an · soit 2 083 FCFA/mois</p>
              </div>
              <div class="inline-flex items-center gap-1.5 bg-green-400/20 text-green-200 text-xs font-semibold px-2.5 py-1 rounded-full mb-4 -mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                Tu économises 5 000 FCFA/an
              </div>
            </template>

            <ul class="space-y-3 mb-8">
              <li v-for="f in premiumFeatures" :key="f" class="flex items-center gap-2.5 text-sm text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                {{ f }}
              </li>
            </ul>
            <RouterLink to="/register" class="block w-full text-center px-6 py-3 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-xl transition text-sm shadow-sm">
              {{ billingAnnual ? 'Passer en Premium Annuel' : 'Passer en Premium' }}
            </RouterLink>
          </div>

        </div>
        <p class="text-center text-xs text-gray-400 mt-6">Paiement via MTN Mobile Money ou Orange Money · Résiliation à tout moment</p>
      </div>
    </section>

    <!-- ═══ CTA FINAL ═══ -->
    <section class="py-20 px-4 sm:px-6 bg-gradient-to-br from-blue-600 to-blue-700 text-center">
      <div class="max-w-2xl mx-auto">
        <div class="text-5xl mb-5">🎓</div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Commence à apprendre aujourd'hui
        </h2>
        <p class="text-blue-100 mb-8 text-lg">
          Rejoins des milliers d'élèves camerounais qui progressent avec EduAI.
        </p>
        <RouterLink to="/register" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition shadow-xl text-base">
          Créer mon compte gratuit
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </RouterLink>
      </div>
    </section>

    <!-- ═══ FOOTER ═══ -->
    <footer class="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6">
      <div class="max-w-5xl mx-auto">
        <div class="grid sm:grid-cols-3 gap-8 mb-10">
          <div>
            <span class="eduai-logo-white text-xl block mb-3">EduAI</span>
            <p class="text-sm leading-relaxed">Le tuteur IA pour les élèves du secondaire camerounais. Programme MINESEC.</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-300 mb-3">Application</p>
            <ul class="space-y-2 text-sm">
              <li><RouterLink to="/register" class="hover:text-white transition">S'inscrire</RouterLink></li>
              <li><RouterLink to="/login" class="hover:text-white transition">Connexion</RouterLink></li>
              <li><a href="#pricing" class="hover:text-white transition">Tarifs</a></li>
            </ul>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-300 mb-3">Paiement accepté</p>
            <div class="flex items-center gap-3">
              <div class="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-lg">MTN MoMo</div>
              <div class="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Orange Money</div>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-6 text-xs text-center">
          © {{ new Date().getFullYear() }} EduAI Cameroun · Tous droits réservés
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const billingAnnual = ref(false)

const stats = [
  { value: '10+', label: 'Matières couvertes' },
  { value: '7', label: 'Niveaux scolaires' },
  { value: '24/7', label: 'Disponible' },
  { value: '100%', label: 'Programme MINESEC' },
]

const features = [
  {
    icon: '🧮', bg: 'bg-blue-50',
    title: 'Toutes les matières',
    desc: 'Maths, Physique-Chimie, SVT, Français, Histoire-Géo, Philosophie, Informatique et plus encore.'
  },
  {
    icon: '🎯', bg: 'bg-green-50',
    title: 'Adapté à ton niveau',
    desc: 'L\'IA connaît ta classe et ta série (A, C, D…). Les réponses sont calibrées pour toi.'
  },
  {
    icon: '📝', bg: 'bg-purple-50',
    title: 'Exercices & corrections',
    desc: 'Génère des exercices progressifs avec corrections détaillées, étape par étape.'
  },
  {
    icon: '💡', bg: 'bg-yellow-50',
    title: 'Explications claires',
    desc: 'Chaque concept est expliqué simplement, avec des exemples tirés du contexte camerounais.'
  },
  {
    icon: '📄', bg: 'bg-red-50',
    title: 'Export PDF & Word',
    desc: 'Sauvegarde les réponses de l\'IA en document PDF ou Word pour réviser hors-ligne.'
  },
  {
    icon: '🌍', bg: 'bg-indigo-50',
    title: 'Français & Anglais',
    desc: 'Disponible en français et en anglais, pour les filières francophone et anglophone.'
  },
]

const steps = [
  { title: 'Crée ton compte', desc: 'Inscris-toi gratuitement en 1 minute. Renseigne ta classe et ta série.' },
  { title: 'Pose ta question', desc: 'Écris n\'importe quelle question sur tes cours ou demande un exercice.' },
  { title: 'Progresse vite', desc: 'Reçois une réponse personnalisée instantanément et retiens mieux.' },
]

const freeFeatures = [
  '10 messages par jour',
  'Toutes les matières',
  'Historique des conversations',
  'Export PDF',
]

const premiumFeatures = [
  'Messages illimités',
  'Toutes les matières',
  'Historique illimité',
  'Export PDF & Word',
  'Réponses prioritaires',
  'Support dédié',
]
</script>

<style scoped>
.eduai-logo {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  user-select: none;
}

.eduai-logo-white {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;
  user-select: none;
}

.hero-gradient {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
