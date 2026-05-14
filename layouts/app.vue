<template>
  <div class="app-shell">
    <!-- Mobile overlay -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>
    
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed, open: sidebarOpen }">
      <div class="sb-top">
        <NuxtLink to="/" class="sb-logo">
          <div class="sb-logo-box">EC</div>
          <span v-if="!sidebarCollapsed" class="sb-logo-text">EduCoop-IA</span>
        </NuxtLink>
        <button class="sb-toggle" @click="sidebarCollapsed = !sidebarCollapsed" title="Colapsar">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </div>

      <nav class="sb-nav">
        <NuxtLink v-for="item in navItems" :key="item.to"
          :to="item.to" class="sb-link" active-class="sb-link-active"
          :title="item.label">
          <span class="sb-icon" v-html="item.icon"></span>
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
          <button class="sb-switch-btn" @click="handleLogout" title="Cerrar sesión">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </template>
      </div>
    </aside>

    <!-- Main area -->
    <div class="app-main">
      <!-- Top bar -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="mobile-menu-btn" @click="sidebarOpen = !sidebarOpen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
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
          <div class="streak-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            {{ user.streak }}
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="app-content">
        <slot />
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { account } from '~/utils/appwrite'

const user = useUserStore()
const route = useRoute()
const router = useRouter()
const sidebarCollapsed = ref(false)
const sidebarOpen = ref(false)

async function handleLogout() {
  user.logout()
  try { await account.deleteSession('current') } catch (e) {}
  router.push('/login')
}

// Guard: redirect to login if no persona selected
onMounted(async () => {
  if (!user.isLoggedIn) {
    try {
      const authUser = await account.get()
      if (authUser && authUser.emailVerification) {
        await user.loadPersona(authUser.$id)
      } else {
        router.push('/login')
      }
    } catch (e) {
      router.push('/login')
    }
  }
})

// Iconos SVG para navegación (18x18, viewBox 0 0 24 24, stroke="currentColor" fill="none")
const icons = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  cursos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 19.5Z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M9 7h6"/><path d="M9 11h6"/></svg>',
  simulador: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>',
  certificados: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
}
const navItems = [
  { to: '/app/dashboard', icon: icons.dashboard, label: 'Dashboard' },
  { to: '/app/cursos', icon: icons.cursos, label: 'Mis Cursos' },
  { to: '/app/simulador', icon: icons.simulador, label: 'Simulador' },
  { to: '/app/certificados', icon: icons.certificados, label: 'Certificados' },
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
  return pageTitles[p] ?? 'EduCoop-IA'
})
</script>

<style scoped>
.app-shell { display: flex; height: 100vh; overflow: hidden; width: 100%; }

/* ── Sidebar ─────────────────────────── */
.sidebar {
  width: 240px; flex-shrink: 0;
  background: var(--s1); border-right: 1px solid var(--brd);
  display: flex; flex-direction: column;
  height: 100vh; overflow-y: auto;
  transition: width .25s cubic-bezier(.16,1,.3,1);
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
  color: #fff; font-size: 11px; font-weight: 900; letter-spacing: -.5px;
}
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
.sb-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 20px; height: 20px; }
.sb-icon svg { width: 18px; height: 18px; }
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
.app-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }

.topbar {
  flex-shrink: 0;
  background: rgba(246,244,239,.9); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--brd);
  padding: 12px 28px;
  display: flex; align-items: center; justify-content: space-between;
}
.page-title { font-family: var(--fd); font-size: 18px; font-weight: 700; color: var(--txt); }
.mobile-menu-btn {
  display: none; align-items: center; justify-content: center;
  background: transparent; border: 1px solid var(--brd);
  border-radius: 6px; color: var(--txt); width: 34px; height: 34px;
  font-size: 18px; cursor: pointer; margin-right: 12px; padding: 0;
}
.topbar-right { display: flex; align-items: center; gap: 12px; }

.sidebar-overlay {
  display: none;
}

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
  display: flex; align-items: center; gap: 5px;
  background: rgba(255,96,88,.1); border: 1px solid rgba(255,96,88,.25);
  border-radius: 100px; padding: 6px 12px; font-size: 13px; font-weight: 700; color: var(--crl);
}

.app-content { flex: 1; padding: 32px; overflow-y: auto; min-height: 0; }

@media (max-width: 768px) {
  .app-shell { flex-direction: column; height: 100dvh; }
  .sidebar { 
    position: fixed; z-index: 100; height: 100%; 
    transform: translateX(-100%); width: 240px;
    transition: transform .25s cubic-bezier(.16,1,.3,1);
  }
  .sidebar.open { transform: translateX(0); }
  .sidebar.collapsed { width: 240px; transform: translateX(-100%); }
  
  .sidebar-overlay {
    display: block;
    position: fixed; inset: 0; z-index: 90;
    background: rgba(0,0,0,.6); backdrop-filter: blur(2px);
  }
  
  .mobile-menu-btn {
    display: flex !important;
  }
  .topbar { padding: 10px 14px; }
  .topbar-left { display: flex; align-items: center; }
  .page-title { font-size: 15px; }
  .app-content { padding: 14px; }
  .xp-chip { display: none; }
  .streak-chip { padding: 4px 8px; font-size: 12px; }
  .sb-toggle { display: none; }
}
</style>
