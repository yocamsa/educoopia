<template>
  <div class="verify-page">
    <div class="verify-card">
      <div v-if="loading">Verificando correo electrónico...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="success">
        <p>¡Correo verificado exitosamente!</p>
        <button class="btn btn-p" @click="goToLogin">Ir al inicio de sesión</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { account } from '~/utils/appwrite'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const userId = route.query.userId as string
  const secret = route.query.secret as string

  if (!userId || !secret) {
    error.value = 'Faltan parámetros de verificación.'
    loading.value = false
    return
  }

  try {
    await account.updateVerification(userId, secret)
    loading.value = false
  } catch (err: any) {
    error.value = err.message || 'Error al verificar el correo.'
    loading.value = false
  }
})

function goToLogin() {
  router.push('/login')
}
</script>

<style scoped>
.verify-page {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: var(--bg); padding: 20px;
}
.verify-card {
  background: var(--s1); border: 1.5px solid var(--brd); border-radius: 18px;
  padding: 30px; text-align: center; max-width: 400px; width: 100%;
}
.error { color: #ff5c5c; margin-bottom: 20px; }
.success { color: var(--grn); }
.success p { margin-bottom: 20px; }
</style>
