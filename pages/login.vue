<template>
  <div class="login-page">
    <canvas ref="cnv" class="bg-canvas"></canvas>

    <div class="login-wrap">
      <div class="login-header">
        <div class="login-logo">
          <div class="ll-box">IA</div>
          <span><em>IA</em>-COOP</span>
        </div>
        <p class="login-tagline">Selecciona un perfil para explorar la plataforma</p>
      </div>

      <!-- Persona cards -->
      <div class="personas-grid">
        <button v-for="p in personas" :key="p.id"
          class="persona-card" :class="{ selected: selected === p.id }"
          @click="selected = p.id">

          <div class="pc-check" v-if="selected === p.id">✓</div>
          <div class="pc-avatar">{{ p.avatar }}</div>
          <div class="pc-name">{{ p.profile.name }}</div>
          <div class="pc-role">{{ p.profile.role }}</div>
          <div class="pc-meta">
            <span class="tag">{{ p.profile.sector }}</span>
            <span class="tag">{{ p.profile.city }}</span>
            <span class="tag">{{ p.profile.age }} años</span>
          </div>
          <div class="pc-since">Asociado desde {{ p.profile.memberSince }}</div>

          <div class="pc-level">
            <div class="pcl-bar">
              <div class="pcl-fill" :style="{ width: Math.min((p.xp / ((p.level + 1) * 800)) * 100, 100) + '%' }"></div>
            </div>
            <span>Nv.{{ p.level }} · {{ levelName(p.level) }}</span>
          </div>

          <div class="pc-ai-tag">{{ p.aiTag }}</div>
          <div class="pc-ai-desc">{{ p.aiDesc }}</div>

          <!-- Badges preview -->
          <div class="pc-badges">
            <span v-for="b in p.badges.filter(b => b.earned)" :key="b.id" :title="b.name">{{ b.emoji }}</span>
            <span v-if="p.certificates.length" class="pc-certs">🏆 {{ p.certificates.length }} cert.</span>
          </div>
        </button>
      </div>

      <div class="login-footer">
        <button class="btn btn-p login-btn" :disabled="!selected" @click="enter">
          Entrar como {{ selectedPersona?.profile.name.split(' ')[0] ?? '...' }} →
        </button>
        <p class="login-note">Estado de progreso ficticio para demostración · Sin datos reales</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore, PERSONAS } from '~/stores/user'
definePageMeta({ layout: 'default' })

const user = useUserStore()
const router = useRouter()
const cnv = ref<HTMLCanvasElement>()
const selected = ref<string | null>(null)

const personas = PERSONAS
const selectedPersona = computed(() => PERSONAS.find(p => p.id === selected.value))

const levelNames = ['', 'Semilla', 'Brote', 'Aprendiz', 'Estudiante', 'Explorador', 'Conocedor', 'Experto', 'Líder', 'Maestro', 'Leyenda']
function levelName(l: number) { return levelNames[Math.min(l, 10)] ?? 'Leyenda' }

function enter() {
  if (!selected.value) return
  user.loadPersona(selected.value)
  router.push('/app/dashboard')
}

onMounted(() => {
  // Redirect if already logged in
  if (user.isLoggedIn) { router.push('/app/dashboard'); return }

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
.login-wrap { position: relative; z-index: 1; width: 100%; max-width: 1000px; }

.login-header { text-align: center; margin-bottom: 36px; }
.login-logo {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--fd); font-weight: 800; font-size: 28px; color: var(--txt); margin-bottom: 12px;
}
.ll-box { width: 40px;height:40px;background:var(--grn);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--bg);font-size:16px;font-weight:900; }
.login-logo em { color: var(--grn); font-style: normal; }
.login-tagline { font-size: 16px; color: var(--txt2); }

.personas-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }

.persona-card {
  background: var(--s1); border: 1.5px solid var(--brd); border-radius: 18px;
  padding: 20px; text-align: left; cursor: pointer; transition: all .22s;
  position: relative; display: flex; flex-direction: column; gap: 8px;
}
.persona-card:hover { border-color: var(--brd2); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,.4); }
.persona-card.selected { border-color: var(--grn); background: rgba(57,255,138,.05); box-shadow: 0 0 0 3px rgba(57,255,138,.15), 0 12px 40px rgba(0,0,0,.3); }

.pc-check {
  position: absolute; top: 12px; right: 12px;
  width: 22px; height: 22px; background: var(--grn); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--bg); font-size: 12px; font-weight: 800;
  animation: fadeUp .2s ease;
}
.pc-avatar { font-size: 36px; margin-bottom: 4px; }
.pc-name { font-family: var(--fd); font-size: 16px; font-weight: 800; color: var(--txt); }
.pc-role { font-size: 11px; color: var(--grn); font-weight: 700; letter-spacing: .05em; }
.pc-meta { display: flex; flex-wrap: wrap; gap: 5px; }
.pc-since { font-size: 11px; color: var(--txt3); }

.pc-level { display: flex; align-items: center; gap: 8px; }
.pcl-bar { flex: 1; height: 4px; background: var(--s3); border-radius: 2px; overflow: hidden; }
.pcl-fill { height: 100%; background: linear-gradient(90deg, var(--grn), var(--gld)); border-radius: 2px; }
.pc-level span { font-size: 11px; color: var(--txt3); font-weight: 600; white-space: nowrap; }

.pc-ai-tag {
  background: var(--grn-b); border: 1px solid var(--brd2); border-radius: 6px;
  padding: 4px 8px; font-size: 10px; font-weight: 700; color: var(--grn);
  letter-spacing: .04em;
}
.pc-ai-desc { font-size: 11px; color: var(--txt3); line-height: 1.5; flex: 1; }

.pc-badges { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
.pc-badges span { font-size: 16px; }
.pc-certs { font-size: 11px; font-weight: 700; color: var(--gld); background: var(--gld-a); border-radius: 100px; padding: 2px 8px; }

.login-footer { text-align: center; }
.login-btn { font-size: 16px; padding: 14px 36px; }
.login-note { font-size: 12px; color: var(--txt3); margin-top: 12px; }

@media(max-width:900px) { .personas-grid { grid-template-columns: repeat(2,1fr); } }
@media(max-width:500px) { .personas-grid { grid-template-columns: 1fr; } }
</style>
