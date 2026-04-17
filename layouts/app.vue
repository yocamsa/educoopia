<template>
  <div class="app-shell">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sb-top">
        <NuxtLink to="/" class="sb-logo">
          <div class="sb-logo-box">IA</div>
          <span v-if="!sidebarCollapsed" class="sb-logo-text"><em>IA</em>-COOP</span>
        </NuxtLink>
        <button class="sb-toggle" @click="sidebarCollapsed = !sidebarCollapsed" title="Colapsar">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </div>

      <nav class="sb-nav">
        <NuxtLink v-for="item in navItems" :key="item.to"
          :to="item.to" class="sb-link" active-class="sb-link-active"
          :title="item.label">
          <span class="sb-icon">{{ item.icon }}</span>
          <span v-if="!sidebarCollapsed" class="sb-label">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="sb-user" :class="{ 'sb-user-collapsed': sidebarCollapsed }">
        <div class="sb-user-av" :title="user.profile.name">{{ initials }}</div>
        <template v-if="!sidebarCollapsed">
          <div class="sb-user-info">
            <div class="sb-user-name">{{ user.profile.name.split(' ')[0] }}</div>
            <div class="sb-user-level">Nv.{{ user.level }} · {{ user.levelName }}</div>
          </div>
          <button class="sb-switch-btn" @click="switchUser" title="Cambiar usuario">⇄</button>
        </template>
      </div>
    </aside>

    <!-- Main area -->
    <div class="app-main">
      <!-- Top bar -->
      <header class="topbar">
        <div class="topbar-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
        <div class="topbar-right">
          <!-- XP chip -->
          <div class="xp-chip">
            <div class="xp-chip-bar">
              <div class="xp-chip-fill" :style="{ width: user.xpPercent + '%' }"></div>
            </div>
            <span class="xp-chip-text">{{ user.xp.toLocaleString('es-CO') }} XP</span>
            <span class="xp-chip-level">Nv.{{ user.level }}</span>
          </div>
          <!-- Streak -->
          <div class="streak-chip">🔥 {{ user.streak }}</div>
        </div>
      </header>

      <!-- Page content -->
      <main class="app-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const user = useUserStore()
const route = useRoute()
const router = useRouter()
const sidebarCollapsed = ref(false)

function switchUser() {
  user.logout()
  router.push('/login')
}

// Guard: redirect to login if no persona selected
onMounted(() => {
  if (!user.isLoggedIn) router.push('/login')
})

const navItems = [
  { to: '/app/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/app/cursos', icon: '📚', label: 'Mis Cursos' },
  { to: '/app/simulador', icon: '📊', label: 'Simulador' },
  { to: '/app/certificados', icon: '🏆', label: 'Certificados' },
]

const initials = computed(() => {
  const parts = user.profile.name.split(' ')
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
})

const pageTitles: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/cursos': 'Mis Cursos',
  '/app/simulador': 'Simulador Financiero',
  '/app/certificados': 'Mis Certificados',
}
const pageTitle = computed(() => {
  const p = route.path
  if (p.startsWith('/app/cursos/')) return 'Curso'
  return pageTitles[p] ?? 'IA-COOP'
})
</script>

<style scoped>
.app-shell { display: flex; min-height: 100vh; }

/* ── Sidebar ─────────────────────────── */
.sidebar {
  width: 240px; min-height: 100vh;
  background: var(--s1); border-right: 1px solid var(--brd);
  display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100vh;
  transition: width .25s cubic-bezier(.16,1,.3,1);
  flex-shrink: 0;
}
.sidebar.collapsed { width: 60px; }

.sb-top {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 14px 14px; border-bottom: 1px solid var(--brd);
}
.sb-logo {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--fd); font-weight: 800; font-size: 17px; color: var(--txt);
  text-decoration: none; overflow: hidden; white-space: nowrap;
}
.sb-logo-box {
  width: 30px; height: 30px; background: var(--grn); border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: var(--bg); font-size: 11px; font-weight: 900; letter-spacing: -.5px;
}
.sb-logo-text em { color: var(--grn); font-style: normal; }
.sb-toggle {
  background: transparent; border: 1px solid var(--brd); border-radius: 6px;
  color: var(--txt3); width: 24px; height: 24px; font-size: 10px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .2s; flex-shrink: 0;
}
.sb-toggle:hover { border-color: var(--grn); color: var(--grn); }

.sb-nav { flex: 1; padding: 10px 8px; display: flex; flex-direction: column; gap: 2px; }
.sb-link {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 10px; border-radius: var(--r);
  color: var(--txt3); font-size: 14px; font-weight: 600;
  transition: all .2s; white-space: nowrap; overflow: hidden;
  text-decoration: none;
}
.sb-link:hover { background: var(--s2); color: var(--txt); }
.sb-link-active { background: var(--grn-a) !important; color: var(--grn) !important; border: 1px solid var(--brd2); }
.sb-icon { font-size: 17px; flex-shrink: 0; width: 20px; text-align: center; }
.sb-label { font-size: 13px; }

.sb-user {
  display: flex; align-items: center; gap: 10px;
  padding: 14px; border-top: 1px solid var(--brd);
}
.sb-user-collapsed { justify-content: center; }
.sb-switch-btn {
  margin-left: auto; background: transparent; border: 1px solid var(--brd);
  border-radius: 6px; color: var(--txt3); width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 14px; flex-shrink: 0;
  transition: all .18s;
}
.sb-switch-btn:hover { border-color: var(--grn); color: var(--grn); }
.sb-user-av {
  width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, var(--grn), var(--gld));
  display: flex; align-items: center; justify-content: center;
  font-family: var(--fd); font-size: 13px; font-weight: 800; color: var(--bg);
}
.sb-user-name { font-size: 13px; font-weight: 700; color: var(--txt); }
.sb-user-level { font-size: 11px; color: var(--txt3); }

/* ── Main ────────────────────────────── */
.app-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

.topbar {
  position: sticky; top: 0; z-index: 50;
  background: rgba(5,14,8,.9); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--brd);
  padding: 12px 28px;
  display: flex; align-items: center; justify-content: space-between;
}
.page-title { font-family: var(--fd); font-size: 18px; font-weight: 700; color: var(--txt); }
.topbar-right { display: flex; align-items: center; gap: 12px; }

.xp-chip {
  display: flex; align-items: center; gap: 8px;
  background: var(--s2); border: 1px solid var(--brd); border-radius: 100px;
  padding: 6px 14px;
}
.xp-chip-bar {
  width: 60px; height: 4px; background: var(--s3); border-radius: 2px; overflow: hidden;
}
.xp-chip-fill {
  height: 100%; background: linear-gradient(90deg, var(--grn), var(--gld));
  border-radius: 2px; transition: width .6s;
}
.xp-chip-text { font-size: 12px; font-weight: 700; color: var(--grn); }
.xp-chip-level { font-size: 11px; color: var(--txt3); font-weight: 600; }

.streak-chip {
  background: rgba(255,96,88,.1); border: 1px solid rgba(255,96,88,.25);
  border-radius: 100px; padding: 6px 12px; font-size: 13px; font-weight: 700; color: var(--crl);
}

.app-content { flex: 1; padding: 28px; overflow-y: auto; }

@media (max-width: 768px) {
  .sidebar { position: fixed; z-index: 100; height: 100%; }
  .sidebar.collapsed { width: 0; overflow: hidden; }
  .app-main { margin-left: 0; }
}
</style>
