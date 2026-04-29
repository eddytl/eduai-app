<template>
  <div class="dashboard">
    <h1>Tableau de bord</h1>
    <p>Bienvenue, {{ auth.user?.name }}</p>
    <RouterLink to="/chat">Aller au chat</RouterLink>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth.store.js'
const auth = useAuthStore()
</script>
