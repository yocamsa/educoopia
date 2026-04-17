<template>
  <div v-if="course" class="player">

    <!-- Sidebar -->
    <aside class="player-aside">
      <NuxtLink to="/app/cursos" class="back-btn">← Volver a cursos</NuxtLink>

      <div class="course-meta-sb">
        <div class="cm-emoji">{{ course.emoji }}</div>
        <div class="cm-title">{{ course.title }}</div>
        <div class="cm-progress-wrap">
          <div class="cm-pct-label">
            <span>Progreso</span><span style="color:var(--grn)">{{ totalProgress }}%</span>
          </div>
          <div class="pbar"><div class="pbar-fill" :style="{ width: totalProgress + '%' }"></div></div>
        </div>
        <div class="cm-xp">⚡ {{ earnedXP }} / {{ course.totalXP }} XP ganados</div>
      </div>

      <!-- Module tree -->
      <div class="module-tree">
        <div v-for="(mod, mi) in course.modules" :key="mod.id" class="mod-section">
          <div class="mod-hd" @click="toggleMod(mod.id)"
            :class="{ 'mod-done': user.isModuleDone(mod.id), 'mod-active': isModuleExpanded(mod.id) }">
            <span class="mod-hd-icon">
              {{ user.isModuleDone(mod.id) ? '✅' : isModuleExpanded(mod.id) ? '▾' : '▸' }}
            </span>
            <span class="mod-hd-title">{{ mod.title }}</span>
          </div>
          <div v-if="isModuleExpanded(mod.id)" class="mod-lessons">
            <div v-for="lesson in mod.lessons" :key="lesson.id"
              class="lesson-item" :class="{
                'lesson-active': currentLesson?.id === lesson.id,
                'lesson-done': user.isLessonDone(lesson.id)
              }"
              @click="selectLesson(mod, lesson)">
              <span>{{ user.isLessonDone(lesson.id) ? '✅' : '○' }}</span>
              <span class="li-title">{{ lesson.title }}</span>
              <span class="li-dur">{{ lesson.duration }}m</span>
            </div>
            <!-- Quiz entry -->
            <div v-if="allLessonsInModuleDone(mod) && !user.isModuleDone(mod.id)"
              class="quiz-item" @click="startQuiz(mod)">
              <span>📝</span><span class="li-title">Quiz del módulo</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content area -->
    <main class="player-main">

      <!-- Course completed -->
      <div v-if="courseCompleted" class="completion-screen">
        <div class="comp-confetti">🎉</div>
        <h1 class="comp-title">¡Curso completado!</h1>
        <p class="comp-sub">Has completado <strong>{{ course.title }}</strong>.<br>Tu certificado está listo.</p>
        <div class="comp-xp">+{{ course.totalXP }} XP ganados 🚀</div>
        <div class="comp-actions">
          <NuxtLink to="/app/certificados" class="btn btn-p" style="font-size:15px;padding:14px 28px;">
            🏆 Ver mi certificado
          </NuxtLink>
          <NuxtLink to="/app/cursos" class="btn btn-o" style="font-size:15px;padding:14px 28px;">
            Explorar más cursos
          </NuxtLink>
        </div>
      </div>

      <!-- Quiz mode -->
      <div v-else-if="showQuiz && quizModule" class="quiz-view">
        <div class="quiz-header">
          <div class="quiz-title">📝 Quiz: {{ quizModule.title }}</div>
          <div class="quiz-subtitle">Responde correctamente para desbloquear el siguiente módulo y ganar XP</div>
        </div>

        <div v-if="!quizDone">
          <div class="q-progress">
            Pregunta {{ quizIndex + 1 }} de {{ quizModule.quiz.length }}
            <div class="q-dots">
              <span v-for="(_, i) in quizModule.quiz" :key="i" class="q-dot"
                :class="{ active: i === quizIndex, done: i < quizIndex, correct: quizResults[i] === true, wrong: quizResults[i] === false }">
              </span>
            </div>
          </div>

          <div class="q-card">
            <div class="q-text">{{ currentQuestion.q }}</div>
            <div class="q-opts">
              <button v-for="(opt, i) in currentQuestion.opts" :key="i"
                class="q-opt" :class="{
                  selected: selectedOpt === i,
                  correct: answered && i === currentQuestion.answer,
                  wrong: answered && selectedOpt === i && i !== currentQuestion.answer
                }"
                :disabled="answered"
                @click="selectOpt(i)">
                <span class="q-opt-letter">{{ ['A', 'B', 'C', 'D'][i] }}</span>
                {{ opt }}
              </button>
            </div>
            <div v-if="answered" class="q-feedback" :class="{ correct: selectedOpt === currentQuestion.answer }">
              {{ selectedOpt === currentQuestion.answer ? '✅ ¡Correcto!' : `❌ Incorrecto. La respuesta era: ${currentQuestion.opts[currentQuestion.answer]}` }}
            </div>
            <button v-if="answered" class="btn btn-p" style="margin-top:16px;width:100%"
              @click="nextQuestion">
              {{ quizIndex < quizModule.quiz.length - 1 ? 'Siguiente pregunta →' : 'Ver resultado' }}
            </button>
            <button v-else class="btn btn-p" :disabled="selectedOpt === null" style="margin-top:16px;width:100%"
              @click="confirmAnswer">
              Confirmar respuesta
            </button>
          </div>
        </div>

        <!-- Quiz result -->
        <div v-else class="quiz-result">
          <div class="qr-score" :class="{ pass: quizPassed }">
            {{ correctCount }} / {{ quizModule.quiz.length }} correctas
          </div>
          <div class="qr-msg">{{ quizPassed ? '¡Excelente! Módulo desbloqueado 🎉' : 'Casi... intenta de nuevo' }}</div>
          <div v-if="quizPassed" class="qr-xp">+{{ moduleXP }} XP</div>
          <button v-if="quizPassed" class="btn btn-p" style="margin-top:16px" @click="onQuizPassed">
            Continuar al siguiente módulo →
          </button>
          <button v-else class="btn btn-o" style="margin-top:16px" @click="retryQuiz">
            Intentar de nuevo
          </button>
        </div>
      </div>

      <!-- Lesson view -->
      <div v-else-if="currentLesson" class="lesson-view">
        <div class="lv-header">
          <div class="lv-breadcrumb">{{ currentModuleTitle }} · Lección {{ currentLessonNum }}</div>
          <h2 class="lv-title">{{ currentLesson.title }}</h2>
          <div class="lv-meta">
            <span>⏱ {{ currentLesson.duration }} min de lectura</span>
            <span>⚡ +{{ currentLesson.xp }} XP al completar</span>
          </div>
        </div>

        <div class="lesson-body" v-html="currentLesson.content"></div>

        <div class="lv-footer">
          <button v-if="!user.isLessonDone(currentLesson.id)"
            class="btn btn-p" style="font-size:15px;padding:14px 28px"
            @click="completeLesson">
            ✅ He leído esta lección (+{{ currentLesson.xp }} XP)
          </button>
          <div v-else class="lesson-done-msg">
            ✅ Lección completada
            <button v-if="nextLesson" class="btn btn-sm btn-o" @click="selectLesson(currentModule!, nextLesson)">
              Siguiente: {{ nextLesson.title }} →
            </button>
            <button v-else-if="canStartQuiz" class="btn btn-sm btn-p" @click="startQuiz(currentModule!)">
              📝 Quiz del módulo →
            </button>
          </div>
        </div>
      </div>

      <!-- Welcome screen -->
      <div v-else class="welcome-view">
        <div class="wv-emoji">{{ course.emoji }}</div>
        <h2>{{ course.title }}</h2>
        <p>{{ course.description }}</p>
        <div class="wv-meta">
          <span :class="`chip-${course.level}`">{{ course.level }}</span>
          <span class="tag">{{ course.duration }} min</span>
          <span class="tag">{{ course.totalXP }} XP</span>
          <span class="tag">{{ course.modules.length }} módulos</span>
        </div>
        <button class="btn btn-p" style="margin-top:24px;font-size:15px;padding:14px 28px"
          @click="startCourse">
          Comenzar curso →
        </button>
      </div>

    </main>

    <!-- XP flash overlay -->
    <Teleport to="body">
      <div v-if="xpFlashVisible" class="xp-flash" :style="xpFlashStyle">
        +{{ xpFlashAmount }} XP
      </div>
    </Teleport>

  </div>
  <div v-else class="not-found">
    <h2>Curso no encontrado</h2>
    <NuxtLink to="/app/cursos" class="btn btn-p">← Volver a cursos</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { useCoursesStore, type Module, type Lesson, type QuizQuestion } from '~/stores/courses'
definePageMeta({ layout: 'app' })

const route = useRoute()
const user = useUserStore()
const coursesStore = useCoursesStore()
const course = computed(() => coursesStore.getCourse(route.params.id as string))

// ── Sidebar state ────────────────────────
const expandedMods = ref<string[]>([])
function toggleMod(id: string) {
  const i = expandedMods.value.indexOf(id)
  if (i >= 0) expandedMods.value.splice(i, 1)
  else expandedMods.value.push(id)
}
function isModuleExpanded(id: string) { return expandedMods.value.includes(id) }

// ── Lesson navigation ────────────────────
const currentModule = ref<Module | null>(null)
const currentLesson = ref<Lesson | null>(null)
const showQuiz = ref(false)
const quizModule = ref<Module | null>(null)

function selectLesson(mod: Module, lesson: Lesson) {
  currentModule.value = mod
  currentLesson.value = lesson
  showQuiz.value = false
  if (!isModuleExpanded(mod.id)) expandedMods.value.push(mod.id)
}

function startCourse() {
  const firstMod = course.value?.modules[0]
  if (firstMod) {
    expandedMods.value = [firstMod.id]
    selectLesson(firstMod, firstMod.lessons[0])
  }
}

function allLessonsInModuleDone(mod: Module) {
  return mod.lessons.every(l => user.isLessonDone(l.id))
}

const currentModuleTitle = computed(() => currentModule.value?.title ?? '')
const currentLessonNum = computed(() => {
  if (!currentModule.value || !currentLesson.value) return 0
  return currentModule.value.lessons.findIndex(l => l.id === currentLesson.value!.id) + 1
})

const nextLesson = computed(() => {
  if (!currentModule.value || !currentLesson.value) return null
  const idx = currentModule.value.lessons.findIndex(l => l.id === currentLesson.value!.id)
  return currentModule.value.lessons[idx + 1] ?? null
})

const canStartQuiz = computed(() => {
  if (!currentModule.value) return false
  return allLessonsInModuleDone(currentModule.value) && !user.isModuleDone(currentModule.value.id)
})

// ── Progress ─────────────────────────────
const totalProgress = computed(() =>
  course.value ? coursesStore.getCourseProgress(course.value.id, user.completedLessons) : 0
)
const earnedXP = computed(() => {
  if (!course.value) return 0
  return course.value.modules.flatMap(m => m.lessons)
    .filter(l => user.isLessonDone(l.id))
    .reduce((s, l) => s + l.xp, 0)
})
const moduleXP = computed(() => {
  if (!quizModule.value) return 0
  return quizModule.value.lessons.reduce((s, l) => s + Math.round(l.xp * 0.3), 0) + 30
})

// ── Complete lesson ───────────────────────
const xpFlashVisible = ref(false)
const xpFlashAmount = ref(0)
const xpFlashStyle = ref({})

function showXpFlash(amount: number, x: number, y: number) {
  xpFlashAmount.value = amount
  xpFlashStyle.value = { left: x + 'px', top: y + 'px' }
  xpFlashVisible.value = true
  setTimeout(() => { xpFlashVisible.value = false }, 900)
}

function completeLesson(e?: MouseEvent) {
  if (!currentLesson.value) return
  const earned = user.completeLesson(currentLesson.value.id, currentLesson.value.xp)
  if (earned > 0) showXpFlash(earned, (e?.clientX ?? 200), (e?.clientY ?? 200))
}

// ── Course completion ─────────────────────
const courseCompleted = ref(false)

watch(() => user.completedModules, (mods) => {
  if (!course.value) return
  const allDone = course.value.modules.every(m => mods.includes(m.id))
  if (allDone && !user.isCourseDone(course.value.id)) {
    user.completeCourse(course.value.id, course.value.title, Math.round(course.value.duration / 60 * 10) + 15)
    user.addXP(100) // completion bonus
    courseCompleted.value = true
  }
}, { deep: true })

// ── Quiz state ────────────────────────────
const quizIndex = ref(0)
const selectedOpt = ref<number | null>(null)
const answered = ref(false)
const quizResults = ref<(boolean | null)[]>([])
const quizDone = ref(false)
const correctCount = ref(0)

const currentQuestion = computed<QuizQuestion>(() => quizModule.value!.quiz[quizIndex.value])
const quizPassed = computed(() => correctCount.value >= Math.ceil((quizModule.value?.quiz.length ?? 0) * 0.67))

function startQuiz(mod: Module) {
  quizModule.value = mod
  showQuiz.value = true
  resetQuiz()
}

function resetQuiz() {
  quizIndex.value = 0
  selectedOpt.value = null
  answered.value = false
  quizResults.value = []
  quizDone.value = false
  correctCount.value = 0
}

function retryQuiz() {
  resetQuiz()
}

function selectOpt(i: number) {
  if (!answered.value) selectedOpt.value = i
}

function confirmAnswer() {
  if (selectedOpt.value === null) return
  answered.value = true
  const correct = selectedOpt.value === currentQuestion.value.answer
  quizResults.value.push(correct)
  if (correct) correctCount.value++
}

function nextQuestion() {
  if (quizIndex.value < (quizModule.value?.quiz.length ?? 0) - 1) {
    quizIndex.value++
    selectedOpt.value = null
    answered.value = false
  } else {
    quizDone.value = true
  }
}

function onQuizPassed() {
  if (!quizModule.value) return
  user.completeModule(quizModule.value.id)
  showXpFlash(moduleXP.value, 600, 300)
  user.addXP(moduleXP.value)

  // Find next module
  const mods = course.value!.modules
  const idx = mods.findIndex(m => m.id === quizModule.value!.id)
  const nextMod = mods[idx + 1]

  if (nextMod) {
    showQuiz.value = false
    quizModule.value = null
    expandedMods.value = [nextMod.id]
    selectLesson(nextMod, nextMod.lessons[0])
  } else {
    showQuiz.value = false
    quizModule.value = null
  }
}

// ── Init ──────────────────────────────────
onMounted(() => {
  if (!course.value) return
  // Check if already completed
  if (user.isCourseDone(course.value.id)) {
    courseCompleted.value = true
    return
  }
  // Open first incomplete module
  const firstIncompleteMod = course.value.modules.find(m => !user.isModuleDone(m.id))
  if (firstIncompleteMod) expandedMods.value = [firstIncompleteMod.id]
})
</script>

<style scoped>
.player { display: grid; grid-template-columns: 280px 1fr; min-height: calc(100vh - 62px); gap: 0; margin: -28px; }
.not-found { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; gap: 16px; }

/* ── Sidebar ──────────────────────────── */
.player-aside {
  background: var(--s1); border-right: 1px solid var(--brd);
  padding: 20px; overflow-y: auto; max-height: calc(100vh - 62px);
  position: sticky; top: 62px;
}
.back-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: var(--txt3);
  text-decoration: none; margin-bottom: 20px; transition: color .2s;
}
.back-btn:hover { color: var(--grn); }

.course-meta-sb { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--brd); }
.cm-emoji { font-size: 30px; margin-bottom: 8px; }
.cm-title { font-family: var(--fd); font-size: 15px; font-weight: 700; margin-bottom: 12px; line-height: 1.3; }
.cm-pct-label { display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; color: var(--txt3); margin-bottom: 5px; }
.cm-xp { font-size: 11px; color: var(--txt3); margin-top: 6px; font-weight: 600; }

.module-tree { display: flex; flex-direction: column; gap: 4px; }
.mod-hd {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 10px; border-radius: 9px; cursor: pointer;
  background: var(--s2); border: 1px solid var(--brd);
  transition: all .18s; user-select: none;
}
.mod-hd:hover { border-color: var(--brd2); }
.mod-hd.mod-done { background: rgba(57,255,138,.06); border-color: var(--brd2); }
.mod-hd.mod-active { background: var(--s3); border-color: var(--brd2); }
.mod-hd-icon { font-size: 12px; flex-shrink: 0; }
.mod-hd-title { font-size: 12px; font-weight: 700; color: var(--txt); line-height: 1.3; }

.mod-lessons { padding: 6px 0 6px 12px; }
.lesson-item {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 10px; border-radius: 8px; cursor: pointer;
  font-size: 12px; color: var(--txt3); transition: all .18s;
}
.lesson-item:hover { background: var(--s2); color: var(--txt); }
.lesson-item.lesson-active { background: var(--grn-a); color: var(--grn); border: 1px solid var(--brd2); }
.lesson-item.lesson-done { color: var(--txt2); }
.li-title { flex: 1; font-weight: 600; line-height: 1.3; }
.li-dur { font-size: 10px; color: var(--txt3); flex-shrink: 0; }

.quiz-item {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 10px; border-radius: 8px; cursor: pointer;
  font-size: 12px; color: var(--gld); font-weight: 700;
  background: rgba(245,192,24,.07); border: 1px solid rgba(245,192,24,.2);
  margin-top: 4px; transition: all .18s;
}
.quiz-item:hover { background: rgba(245,192,24,.12); }

/* ── Main ─────────────────────────────── */
.player-main { padding: 32px; overflow-y: auto; max-height: calc(100vh - 62px); }

/* Welcome view */
.welcome-view { text-align: center; padding: 60px 40px; max-width: 560px; margin: 0 auto; }
.wv-emoji { font-size: 56px; margin-bottom: 20px; }
.welcome-view h2 { font-size: 28px; margin-bottom: 12px; }
.welcome-view p { font-size: 15px; color: var(--txt2); line-height: 1.7; margin-bottom: 16px; }
.wv-meta { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }

/* Lesson view */
.lv-header { margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--brd); }
.lv-breadcrumb { font-size: 12px; color: var(--txt3); font-weight: 600; margin-bottom: 8px; }
.lv-title { font-size: 26px; font-weight: 800; margin-bottom: 10px; }
.lv-meta { display: flex; gap: 16px; font-size: 13px; color: var(--txt3); font-weight: 600; }

.lv-footer { margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--brd); }
.lesson-done-msg { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 700; color: var(--grn); flex-wrap: wrap; }

/* Quiz view */
.quiz-view { max-width: 700px; }
.quiz-header { margin-bottom: 28px; }
.quiz-title { font-family: var(--fd); font-size: 22px; font-weight: 800; margin-bottom: 6px; }
.quiz-subtitle { font-size: 14px; color: var(--txt2); }

.q-progress { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; font-size: 13px; font-weight: 600; color: var(--txt3); }
.q-dots { display: flex; gap: 6px; }
.q-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--s3); border: 1px solid var(--brd); transition: all .2s; }
.q-dot.active { background: var(--grn); border-color: var(--grn); box-shadow: 0 0 8px rgba(57,255,138,.4); }
.q-dot.correct { background: var(--grn); border-color: var(--grn); }
.q-dot.wrong { background: var(--crl); border-color: var(--crl); }

.q-card { background: var(--s1); border: 1px solid var(--brd); border-radius: 18px; padding: 24px; }
.q-text { font-size: 17px; font-weight: 700; margin-bottom: 20px; line-height: 1.5; }
.q-opts { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.q-opt {
  display: flex; align-items: center; gap: 12px;
  background: var(--s2); border: 1px solid var(--brd); border-radius: 11px;
  padding: 12px 16px; text-align: left; font-size: 14px; color: var(--txt);
  cursor: pointer; transition: all .18s;
}
.q-opt:hover:not(:disabled) { border-color: var(--brd2); background: var(--s3); }
.q-opt.selected { border-color: var(--grn); background: var(--grn-a); }
.q-opt.correct { border-color: var(--grn); background: rgba(57,255,138,.12); color: var(--grn); }
.q-opt.wrong { border-color: var(--crl); background: rgba(255,96,88,.1); color: var(--crl); }
.q-opt:disabled { cursor: default; }
.q-opt-letter {
  width: 24px; height: 24px; border-radius: 6px; flex-shrink: 0;
  background: var(--s3); font-weight: 700; font-size: 12px;
  display: flex; align-items: center; justify-content: center;
}
.q-feedback {
  padding: 12px 16px; border-radius: 10px; font-size: 13px; font-weight: 600;
  background: rgba(255,96,88,.1); color: var(--crl); border: 1px solid rgba(255,96,88,.25);
}
.q-feedback.correct { background: rgba(57,255,138,.1); color: var(--grn); border-color: var(--brd2); }

.quiz-result { text-align: center; padding: 40px 20px; }
.qr-score { font-family: var(--fd); font-size: 52px; font-weight: 800; color: var(--crl); margin-bottom: 12px; }
.qr-score.pass { color: var(--grn); }
.qr-msg { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.qr-xp { font-size: 24px; font-weight: 800; color: var(--grn); font-family: var(--fd); }

/* Completion screen */
.completion-screen { text-align: center; padding: 60px 40px; max-width: 540px; margin: 0 auto; }
.comp-confetti { font-size: 72px; margin-bottom: 16px; animation: bnc 1s ease-in-out infinite; }
.comp-title { font-size: 36px; font-weight: 800; margin-bottom: 12px; color: var(--grn); }
.comp-sub { font-size: 16px; color: var(--txt2); line-height: 1.7; margin-bottom: 16px; }
.comp-xp { font-family: var(--fd); font-size: 24px; font-weight: 800; color: var(--gld); margin-bottom: 28px; }
.comp-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

@media(max-width:800px) {
  .player { grid-template-columns: 1fr; margin: -28px; }
  .player-aside { max-height: none; position: static; border-right: none; border-bottom: 1px solid var(--brd); }
  .player-main { max-height: none; }
}
</style>
