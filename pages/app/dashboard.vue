<template>
  <div class="dashboard">

    <!-- Welcome Banner -->
    <div class="welcome-banner rev" :class="{ on: mounted }">
      <div class="wb-left">
        <div class="wb-avatar">{{ initials }}</div>
        <div>
          <div class="wb-greeting">¡Buenos días, {{ firstName }}! 👋</div>
          <div class="wb-sub">La IA ha preparado {{ recs.length }} recomendaciones para ti hoy</div>
        </div>
      </div>
      <div class="wb-right">
        <div class="wb-stat">
          <div class="wb-stat-n">{{ user.streak }}</div>
          <div class="wb-stat-l">🔥 días de racha</div>
        </div>
        <div class="wb-stat">
          <div class="wb-stat-n">{{ user.completedLessons.length }}</div>
          <div class="wb-stat-l">📚 lecciones</div>
        </div>
        <div class="wb-stat">
          <div class="wb-stat-n">{{ user.certificates.length }}</div>
          <div class="wb-stat-l">🏆 certificados</div>
        </div>
      </div>
    </div>

    <!-- XP Progress -->
    <div class="xp-card rev" :class="{ on: mounted }" style="transition-delay:.1s">
      <div class="xp-top">
        <div class="xp-level-badge">{{ user.level }}</div>
        <div>
          <div class="xp-level-name">Nivel {{ user.level }} — {{ user.levelName }}</div>
          <div class="xp-level-sub">{{ user.xpToNext.toLocaleString('es-CO') }} XP para el siguiente nivel</div>
        </div>
        <div style="margin-left:auto;text-align:right">
          <div class="xp-big">{{ user.xp.toLocaleString('es-CO') }}</div>
          <div style="font-size:11px;color:var(--txt3)">XP Total</div>
        </div>
      </div>
      <div class="xp-bar-w">
        <div class="xp-bar-meta">
          <span>{{ user.xpForCurrentLevel.toLocaleString('es-CO') }}</span>
          <span>{{ user.xpForNextLevel.toLocaleString('es-CO') }} XP</span>
        </div>
        <div class="pbar">
          <div class="pbar-fill" :style="{ width: user.xpPercent + '%' }"></div>
        </div>
      </div>
      <!-- Streak week -->
      <div class="streak-week">
        <div v-for="(day, i) in days" :key="i" class="stk-d" :class="{ done: i < 6, hoy: i === 6 }">
          {{ day }}
        </div>
      </div>
    </div>

    <div class="dash-grid">

      <!-- AI Recommendations -->
      <div class="recs-col rev" :class="{ on: mounted }" style="transition-delay:.2s">
        <div class="sect-hd">
          <div class="lbl">IA recomienda</div>
          <NuxtLink to="/app/cursos" class="sect-more">Ver todos →</NuxtLink>
        </div>

        <div v-if="analyzing" class="ai-analyzing">
          <div class="ai-pulse"></div>
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--grn)">🤖 Analizando tu perfil...</div>
            <div style="font-size:12px;color:var(--txt3)">Procesando 20+ variables</div>
          </div>
        </div>

        <div v-else>
          <NuxtLink v-for="r in recs" :key="r.id" :to="`/app/cursos/${r.id}`" class="rec-card">
            <div class="rec-card-top">
              <div class="rec-emoji">{{ r.emoji }}</div>
              <div class="rec-info">
                <div class="rec-title">{{ r.title }}</div>
                <div class="rec-meta">{{ r.category }} · {{ r.duration }} min · <span :class="`chip-${r.level}`">{{ r.level }}</span></div>
              </div>
              <div class="rec-match">{{ r.match }}%</div>
            </div>
            <div class="pbar" style="margin-top:10px">
              <div class="pbar-fill" :style="{ width: getProgress(r.id) + '%' }"></div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:6px">
              <span style="font-size:11px;color:var(--txt3)">{{ getProgress(r.id) }}% completado</span>
              <span style="font-size:11px;color:var(--grn);font-weight:700">+{{ r.xp }} XP</span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Right column -->
      <div class="side-col rev" :class="{ on: mounted }" style="transition-delay:.3s">

        <!-- Badges -->
        <div class="card" style="margin-bottom:18px">
          <div class="sect-hd" style="margin-bottom:14px"><div class="lbl">Mis insignias</div></div>
          <div class="bdg-grid">
            <div v-for="b in user.badges" :key="b.id" class="bdg-item" :class="{ earned: b.earned }">
              <span class="bdg-e">{{ b.emoji }}</span>
              <div class="bdg-n">{{ b.name }}</div>
            </div>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="card">
          <div class="sect-hd" style="margin-bottom:14px"><div class="lbl">Acceso rápido</div></div>
          <div class="quick-list">
            <NuxtLink to="/app/cursos" class="quick-item">
              <span>📚</span><span>Explorar cursos</span><span class="qi-arr">→</span>
            </NuxtLink>
            <NuxtLink to="/app/simulador" class="quick-item">
              <span>📊</span><span>Simulador financiero</span><span class="qi-arr">→</span>
            </NuxtLink>
            <NuxtLink to="/app/certificados" class="quick-item">
              <span>🏆</span><span>Mis certificados</span><span class="qi-arr">→</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Leaderboard mini -->
        <div class="card" style="margin-top:18px">
          <div class="sect-hd" style="margin-bottom:14px"><div class="lbl">🏆 Top esta semana</div></div>
          <div v-for="(p, i) in leaderboard" :key="i" class="ldb-row" :class="{ 'ldb-me': p.me }">
            <div class="ldb-num" :style="{ background: ldbColors[i] }">{{ i+1 }}</div>
            <div style="flex:1;font-size:13px;font-weight:600" :style="{ color: p.me ? 'var(--grn)' : 'var(--txt)' }">{{ p.name }}</div>
            <div style="font-size:12px;font-weight:700" :style="{ color: p.me ? 'var(--grn)' : 'var(--txt2)' }">{{ p.xp.toLocaleString('es-CO') }} XP</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { useCoursesStore } from '~/stores/courses'
definePageMeta({ layout: 'app' })

const user = useUserStore()
const courses = useCoursesStore()
const mounted = ref(false)
const analyzing = ref(true)

const firstName = computed(() => user.profile.name.split(' ')[0])
const initials = computed(() => {
  const p = user.profile.name.split(' ')
  return (p[0][0] + (p[1]?.[0] ?? '')).toUpperCase()
})

const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const ldbColors = ['var(--gld)', 'rgba(156,163,175,.4)', 'rgba(156,163,175,.25)', 'var(--grn-a)', 'var(--grn-a)']

const recs = computed(() => [
  { id: 'c3', match: 97, xp: 550, ...courses.getCourse('c3')! },
  { id: 'c5', match: 91, xp: 650, ...courses.getCourse('c5')! },
  { id: 'c4', match: 88, xp: 380, ...courses.getCourse('c4')! },
].filter(r => r.title))

const leaderboard = [
  { name: 'Carlos Mendoza', xp: 5240, me: false },
  { name: 'Ana López', xp: 4890, me: false },
  { name: 'Jorge Rojas', xp: 4320, me: false },
  { name: 'Luz Martínez', xp: 3920, me: false },
  { name: `Tú — ${firstName.value}`, xp: user.xp, me: true },
].sort((a, b) => b.xp - a.xp).slice(0, 5)

function getProgress(courseId: string) {
  return courses.getCourseProgress(courseId, user.completedLessons)
}

onMounted(() => {
  mounted.value = true
  setTimeout(() => { analyzing.value = false }, 2200)
})
</script>

<style scoped>
.dashboard { max-width: 1100px; }

.welcome-banner {
  background: linear-gradient(135deg, var(--s2), var(--s3));
  border: 1px solid var(--brd2); border-radius: 20px; padding: 22px 24px;
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px; position: relative; overflow: hidden;
}
.welcome-banner::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--grn), var(--gld), var(--crl));
}
.wb-left { display: flex; align-items: center; gap: 14px; }
.wb-avatar {
  width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, var(--grn), var(--gld));
  display: flex; align-items: center; justify-content: center;
  font-family: var(--fd); font-size: 18px; font-weight: 800; color: var(--bg);
}
.wb-greeting { font-family: var(--fd); font-size: 20px; font-weight: 700; margin-bottom: 3px; }
.wb-sub { font-size: 13px; color: var(--txt2); }
.wb-right { display: flex; gap: 24px; }
.wb-stat { text-align: center; }
.wb-stat-n { font-family: var(--fd); font-size: 24px; font-weight: 800; color: var(--grn); }
.wb-stat-l { font-size: 11px; color: var(--txt3); font-weight: 600; }

.xp-card {
  background: var(--s1); border: 1px solid var(--brd); border-radius: 18px;
  padding: 22px; margin-bottom: 24px;
}
.xp-top { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.xp-level-badge {
  width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--gld), var(--crl));
  display: flex; align-items: center; justify-content: center;
  font-family: var(--fd); font-size: 20px; font-weight: 800; color: white;
}
.xp-level-name { font-size: 15px; font-weight: 700; color: var(--txt); }
.xp-level-sub { font-size: 12px; color: var(--txt3); }
.xp-big { font-family: var(--fd); font-size: 26px; font-weight: 800; color: var(--gld); }
.xp-bar-w { margin-bottom: 18px; }
.xp-bar-meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--txt3); margin-bottom: 6px; font-weight: 600; }
.streak-week { display: flex; gap: 8px; }
.stk-d {
  flex: 1; height: 28px; border-radius: 7px; background: var(--s3); border: 1px solid var(--brd);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; color: var(--txt3);
}
.stk-d.done { background: rgba(57,255,138,.12); border-color: var(--grn); color: var(--grn); }
.stk-d.hoy { background: var(--grn); border-color: var(--grn); color: var(--bg); box-shadow: 0 0 10px rgba(57,255,138,.4); }

.dash-grid { display: grid; grid-template-columns: 1fr 380px; gap: 20px; }

.sect-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.sect-more { font-size: 13px; color: var(--grn); font-weight: 600; text-decoration: none; }
.sect-more:hover { text-decoration: underline; }

.ai-analyzing {
  background: var(--grn-b); border: 1px solid var(--brd2); border-radius: 14px;
  padding: 18px; display: flex; align-items: center; gap: 14px;
}
.ai-pulse {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  background: var(--grn-a); border: 2px solid var(--grn);
  animation: pulse 1.2s ease-in-out infinite;
}

.rec-card {
  display: block; background: var(--s1); border: 1px solid var(--brd);
  border-radius: 16px; padding: 16px; margin-bottom: 12px;
  transition: border-color .2s, transform .2s; text-decoration: none; color: inherit;
}
.rec-card:hover { border-color: var(--brd2); transform: translateY(-2px); }
.rec-card:last-child { margin-bottom: 0; }
.rec-card-top { display: flex; align-items: center; gap: 12px; }
.rec-emoji { font-size: 26px; flex-shrink: 0; }
.rec-title { font-size: 14px; font-weight: 700; color: var(--txt); margin-bottom: 3px; }
.rec-meta { font-size: 12px; color: var(--txt3); display: flex; align-items: center; gap: 6px; }
.rec-match { font-size: 14px; font-weight: 800; color: var(--grn); margin-left: auto; font-family: var(--fd); }

.bdg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.bdg-item {
  background: var(--s3); border: 1px solid var(--brd); border-radius: 10px;
  padding: 10px; text-align: center; transition: border-color .2s;
}
.bdg-item.earned { border-color: var(--gld-a); background: linear-gradient(135deg, rgba(245,192,24,.08), rgba(255,96,88,.04)); }
.bdg-e { font-size: 20px; display: block; margin-bottom: 3px; }
.bdg-n { font-size: 9px; color: var(--txt3); font-weight: 700; letter-spacing: .04em; }
.bdg-item.earned .bdg-n { color: var(--gld); }

.quick-list { display: flex; flex-direction: column; gap: 8px; }
.quick-item {
  display: flex; align-items: center; gap: 10px;
  padding: 12px; background: var(--s2); border: 1px solid var(--brd); border-radius: 11px;
  font-size: 13px; font-weight: 600; color: var(--txt); text-decoration: none;
  transition: all .2s;
}
.quick-item:hover { border-color: var(--brd2); background: var(--s3); }
.qi-arr { margin-left: auto; color: var(--txt3); transition: transform .2s; }
.quick-item:hover .qi-arr { transform: translateX(3px); color: var(--grn); }

.ldb-row { display: flex; align-items: center; gap: 9px; padding: 7px; border-radius: 8px; margin-bottom: 4px; }
.ldb-me { background: rgba(57,255,138,.06); border: 1px solid var(--brd); }
.ldb-num { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: var(--bg); }

@media(max-width:900px) {
  .dash-grid { grid-template-columns: 1fr; }
  .wb-right { display: none; }
}
</style>
