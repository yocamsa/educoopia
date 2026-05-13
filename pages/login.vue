<template>
  <div class="login-page">
    <canvas ref="cnv" class="bg-canvas"></canvas>

    <div class="login-wrap">
      <div class="login-header">
        <div class="login-logo">
          <div class="ll-box">IA</div>
          <span><em>IA</em>-COOP</span>
        </div>
        <p class="login-tagline">Inicia sesión o regístrate para explorar la plataforma</p>
      </div>

      <div class="auth-card">
        <div class="auth-tabs">
          <button :class="{ active: mode === 'login' }" @click="mode = 'login'">Ingresar</button>
          <button :class="{ active: mode === 'register' }" @click="mode = 'register'">Registrarse</button>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="input-group" v-if="mode === 'register'">
            <label>Nombre</label>
            <input type="text" v-model="form.name" placeholder="Tu nombre completo" required />
          </div>
          <div class="input-group">
            <label>Correo Electrónico</label>
            <input type="email" v-model="form.email" placeholder="correo@ejemplo.com" required />
          </div>
          <div class="input-group">
            <label>Contraseña</label>
            <input type="password" v-model="form.password" placeholder="Mínimo 8 caracteres" required minlength="8" />
          </div>

          <p class="error-msg" v-if="error">{{ error }}</p>
          <p class="success-msg" v-if="success">{{ success }}</p>

          <button type="submit" class="btn btn-p submit-btn" :disabled="loading">
            <span v-if="loading">Cargando...</span>
            <span v-else>{{ mode === 'login' ? 'Entrar →' : 'Crear Cuenta →' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { account, ID } from '~/utils/appwrite'
import { useUserStore } from '~/stores/user'

definePageMeta({ layout: 'default' })

const router = useRouter()
const userStore = useUserStore()
const cnv = ref<HTMLCanvasElement>()
const mode = ref<'login' | 'register'>('login')
const form = reactive({ name: '', email: '', password: '' })
const error = ref('')
const success = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    // Si ya existe una sesión, no intentamos crear otra
    let currentUser: any = null
    try {
      currentUser = await account.get()
    } catch (e) {
      // Ignorar, no hay sesión
    }

    if (mode.value === 'register') {
      if (currentUser) {
        await account.deleteSession('current')
      }
      await account.create(ID.unique(), form.email, form.password, form.name)
      await account.createEmailPasswordSession(form.email, form.password)
      await account.createVerification(`${window.location.origin}/verify`)
      success.value = 'Cuenta creada. Por favor verifica tu correo electrónico.'
      mode.value = 'login'
    } else {
      if (!currentUser) {
        await account.createEmailPasswordSession(form.email, form.password)
        currentUser = await account.get()
      }
      
      if (!currentUser.emailVerification) {
        error.value = 'Por favor verifica tu correo electrónico antes de continuar.'
        await account.deleteSession('current')
        return
      }
      await userStore.loadPersona(currentUser.$id)
      router.push('/app/dashboard')
    }
  } catch (err: any) {
    error.value = err.message || 'Error en la autenticación.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const user = await account.get()
    if (user && user.emailVerification) {
      await userStore.loadPersona(user.$id)
      router.push('/app/dashboard')
    } else if (user && !user.emailVerification) {
      await account.deleteSession('current')
    }
  } catch (e) {
    // Not logged in
  }

  const canvas = cnv.value!
  const ctx = canvas.getContext('2d')!
  let W = 0, H = 0
  const pts: any[] = []
  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight }
  resize(); window.addEventListener('resize', resize)
  for (let i = 0; i < 60; i++) pts.push({ x: Math.random()*1600, y: Math.random()*900, vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3, r: Math.random()*1.5+.3, o: Math.random()*.4+.1 })
  ;(function draw() {
    ctx.clearRect(0,0,W,H)
    for (let i = 0; i < pts.length; i++) {
      for (let j = i+1; j < pts.length; j++) { const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.hypot(dx,dy); if(d<100){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(57,255,138,${.1*(1-d/100)})`;ctx.lineWidth=.5;ctx.stroke()} }
      const p=pts[i];ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(57,255,138,${p.o})`;ctx.fill()
      p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1
    }
    requestAnimationFrame(draw)
  })()
})
</script>

<style scoped>
.login-page {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  padding: 40px 20px; position: relative; background: var(--bg);
}
.bg-canvas { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.login-wrap { position: relative; z-index: 1; width: 100%; max-width: 480px; }

.login-header { text-align: center; margin-bottom: 36px; }
.login-logo {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--fd); font-weight: 800; font-size: 28px; color: var(--txt); margin-bottom: 12px;
}
.ll-box { width: 40px;height:40px;background:var(--grn);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--bg);font-size:16px;font-weight:900; }
.login-logo em { color: var(--grn); font-style: normal; }
.login-tagline { font-size: 16px; color: var(--txt2); }

.auth-card {
  background: var(--s1); border: 1.5px solid var(--brd); border-radius: 18px;
  padding: 30px; box-shadow: 0 12px 40px rgba(0,0,0,.3);
}

.auth-tabs { display: flex; gap: 10px; margin-bottom: 24px; }
.auth-tabs button {
  flex: 1; padding: 10px; background: var(--s2); border: 1px solid var(--brd);
  border-radius: 8px; color: var(--txt2); font-weight: 600; cursor: pointer;
  transition: all .2s;
}
.auth-tabs button.active {
  background: rgba(57,255,138,.1); border-color: var(--grn); color: var(--grn);
}

.auth-form { display: flex; flex-direction: column; gap: 16px; }
.input-group { display: flex; flex-direction: column; gap: 8px; }
.input-group label { font-size: 13px; font-weight: 600; color: var(--txt2); }
.input-group input {
  background: var(--s2); border: 1px solid var(--brd); border-radius: 8px;
  padding: 12px 14px; color: var(--txt); font-size: 14px; outline: none; transition: border-color .2s;
}
.input-group input:focus { border-color: var(--grn); }

.error-msg { color: #ff5c5c; font-size: 13px; font-weight: 600; background: rgba(255,92,92,.1); padding: 10px; border-radius: 8px; }
.success-msg { color: var(--grn); font-size: 13px; font-weight: 600; background: rgba(57,255,138,.1); padding: 10px; border-radius: 8px; }

.submit-btn { width: 100%; padding: 14px; font-size: 16px; margin-top: 8px; }
</style>
