<template>
  <div class="cursos-page">
    <!-- Filters -->
    <div class="filters-bar rev" :class="{ on: mounted }">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input v-model="search" class="search-input" placeholder="Buscar cursos...">
      </div>
      <div class="filter-chips">
        <button v-for="cat in categories" :key="cat"
          class="fchip" :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat">{{ cat }}</button>
      </div>
      <div class="filter-chips">
        <button v-for="lv in levels" :key="lv"
          class="fchip" :class="{ active: activeLevel === lv }"
          @click="activeLevel = lv">{{ lv }}</button>
      </div>
    </div>

    <!-- Stats bar -->
    <div class="stats-bar rev" :class="{ on: mounted }" style="transition-delay:.1s">
      <div class="sbar-item">
        <span class="sbar-n">{{ filtered.length }}</span>
        <span class="sbar-l">cursos disponibles</span>
      </div>
      <div class="sbar-item">
        <span class="sbar-n">{{ completedCount }}</span>
        <span class="sbar-l">completados</span>
      </div>
      <div class="sbar-item">
        <span class="sbar-n">{{ totalXP.toLocaleString('es-CO') }}</span>
        <span class="sbar-l">XP disponible</span>
      </div>
    </div>

    <!-- Course grid -->
    <div v-if="filtered.length > 0" class="course-grid">
      <NuxtLink v-for="(c, i) in filtered" :key="c.id"
        :to="`/app/cursos/${c.id}`" class="ccard rev" :class="{ on: mounted }"
        :style="{ transitionDelay: (0.1 + i * 0.06) + 's' }">

        <div class="ccard-top">
          <div class="ccard-emoji">{{ c.emoji }}</div>
          <div class="ccard-badges">
            <span :class="`chip-${c.level}`">{{ c.level }}</span>
            <span class="tag">{{ c.category }}</span>
            <span v-if="user.isCourseDone(c.id)" class="tag tag-grn">✅ Completado</span>
          </div>
        </div>

        <h3 class="ccard-title">{{ c.title }}</h3>
        <p class="ccard-desc">{{ c.description }}</p>

        <div class="ccard-meta">
          <span>⏱ {{ c.duration }} min</span>
          <span>⚡ {{ c.totalXP }} XP</span>
          <span>📋 {{ c.modules.length }} módulos</span>
        </div>

        <div class="ccard-footer">
          <div class="ccard-progress">
            <div class="pbar"><div class="pbar-fill" :style="{ width: getProgress(c.id) + '%' }"></div></div>
            <span class="ccard-pct">{{ getProgress(c.id) }}%</span>
          </div>
          <span class="ccard-action" :class="{ done: user.isCourseDone(c.id) }">
            {{ user.isCourseDone(c.id) ? 'Ver certificado' : getProgress(c.id) > 0 ? 'Continuar →' : 'Iniciar →' }}
          </span>
        </div>
      </NuxtLink>
    </div>

    <div v-else class="empty">
      <div style="font-size:48px;margin-bottom:12px">🔍</div>
      <h3>No se encontraron cursos</h3>
      <p>Prueba con otros filtros o términos de búsqueda</p>
      <button class="btn btn-o" style="margin-top:16px" @click="clearFilters">Limpiar filtros</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { useCoursesStore } from '~/stores/courses'
definePageMeta({ layout: 'app' })

const user = useUserStore()
const coursesStore = useCoursesStore()
const mounted = ref(false)
const search = ref('')
const activeCategory = ref('Todos')
const activeLevel = ref('Todos')

const categories = ['Todos', 'Principios', 'Finanzas', 'Liderazgo']
const levels = ['Todos', 'basico', 'intermedio', 'avanzado']

const filtered = computed(() => {
  return coursesStore.courses.filter(c => {
    const matchSearch = !search.value || c.title.toLowerCase().includes(search.value.toLowerCase()) || c.description.toLowerCase().includes(search.value.toLowerCase())
    const matchCat = activeCategory.value === 'Todos' || c.category === activeCategory.value
    const matchLv = activeLevel.value === 'Todos' || c.level === activeLevel.value
    return matchSearch && matchCat && matchLv
  })
})

const completedCount = computed(() => coursesStore.courses.filter(c => user.isCourseDone(c.id)).length)
const totalXP = computed(() => filtered.value.reduce((s, c) => s + c.totalXP, 0))

function getProgress(id: string) { return coursesStore.getCourseProgress(id, user.completedLessons) }
function clearFilters() { search.value = ''; activeCategory.value = 'Todos'; activeLevel.value = 'Todos' }

onMounted(() => { mounted.value = true })
</script>

<style scoped>
.cursos-page { max-width: 1100px; }

.filters-bar {
  background: var(--s1); border: 1px solid var(--brd); border-radius: 16px;
  padding: 16px; margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
}
.search-wrap { position: relative; flex: 1; min-width: 220px; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 14px; }
.search-input {
  width: 100%; background: var(--s2); border: 1px solid var(--brd); border-radius: 100px;
  padding: 9px 16px 9px 36px; font-size: 13px; color: var(--txt); outline: none;
  transition: border-color .2s;
}
.search-input::placeholder { color: var(--txt3); }
.search-input:focus { border-color: var(--grn); }

.filter-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.fchip {
  background: var(--s2); border: 1px solid var(--brd); border-radius: 100px;
  padding: 6px 14px; font-size: 12px; font-weight: 600; color: var(--txt3);
  cursor: pointer; transition: all .18s;
}
.fchip:hover { border-color: var(--brd2); color: var(--txt); }
.fchip.active { background: var(--grn-a); border-color: var(--brd2); color: var(--grn); }

.stats-bar {
  display: flex; gap: 24px; margin-bottom: 24px;
  background: var(--s1); border: 1px solid var(--brd); border-radius: 14px; padding: 14px 20px;
}
.sbar-item { display: flex; align-items: center; gap: 8px; }
.sbar-n { font-family: var(--fd); font-size: 20px; font-weight: 800; color: var(--grn); }
.sbar-l { font-size: 12px; color: var(--txt3); font-weight: 600; }

.course-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }

.ccard {
  background: var(--s1); border: 1px solid var(--brd); border-radius: 18px;
  padding: 22px; display: flex; flex-direction: column; gap: 10px;
  text-decoration: none; color: inherit;
  transition: border-color .2s, transform .2s, box-shadow .2s;
}
.ccard:hover { border-color: var(--brd2); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,.35); }
.ccard-top { display: flex; align-items: flex-start; justify-content: space-between; }
.ccard-emoji { font-size: 30px; }
.ccard-badges { display: flex; flex-wrap: wrap; gap: 5px; justify-content: flex-end; }
.ccard-title { font-size: 16px; font-weight: 700; color: var(--txt); line-height: 1.3; }
.ccard-desc { font-size: 13px; color: var(--txt2); line-height: 1.6; flex: 1; }
.ccard-meta { display: flex; gap: 12px; font-size: 12px; color: var(--txt3); font-weight: 600; flex-wrap: wrap; }
.ccard-footer { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
.ccard-progress { flex: 1; display: flex; align-items: center; gap: 8px; }
.ccard-pct { font-size: 11px; font-weight: 700; color: var(--txt3); white-space: nowrap; }
.ccard-action { font-size: 13px; font-weight: 700; color: var(--grn); white-space: nowrap; }
.ccard-action.done { color: var(--gld); }

.empty { text-align: center; padding: 80px 20px; color: var(--txt2); }
.empty h3 { font-size: 20px; margin-bottom: 8px; }
.empty p { font-size: 14px; color: var(--txt3); }

@media(max-width:900px) { .course-grid { grid-template-columns: 1fr; } }
@media(max-width:1100px) { .course-grid { grid-template-columns: repeat(2,1fr); } }
</style>
