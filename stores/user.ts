import { defineStore } from 'pinia'

export interface Persona {
  id: string
  profile: { name: string; cedula: string; city: string; sector: string; age: number; memberSince: number; interests: string[]; role: string }
  level: number
  xp: number
  streak: number
  completedLessons: string[]
  completedModules: string[]
  completedCourses: string[]
  certificates: { id: string; courseId: string; courseTitle: string; issuedAt: Date; certId: string; hours: number; institution: string }[]
  badges: { id: string; emoji: string; name: string; earned: boolean }[]
  aiTag: string
  aiDesc: string
  avatar: string
}

export const PERSONAS: Persona[] = [
  {
    id: 'maria',
    avatar: '👩‍⚕️',
    aiTag: 'Asociada activa · Perfil intermedio',
    aiDesc: 'Enfocada en finanzas y beneficios del sector salud. Buen historial de ahorro.',
    profile: { name: 'María Suárez', cedula: '1.024.567.890', city: 'Bogotá', sector: 'Salud', age: 35, memberSince: 2023, interests: ['Finanzas', 'Salud', 'Ahorro'], role: 'Asociada Activa' },
    level: 7, xp: 3680, streak: 12,
    completedLessons: ['c1-m1-l1', 'c1-m1-l2', 'c1-m2-l1', 'c3-m1-l1'],
    completedModules: ['c1-m1'],
    completedCourses: [],
    certificates: [{ id: 'cert-001', courseId: 'c1', courseTitle: 'Principios Cooperativos', issuedAt: new Date('2026-01-15'), certId: 'IACOOP-2026-001A', hours: 20, institution: 'Universidad Cooperativa de Colombia' }],
    badges: [
      { id: 'first', emoji: '🌟', name: 'Primer Módulo', earned: true },
      { id: 'streak10', emoji: '🔥', name: '10 Días', earned: true },
      { id: 'curious', emoji: '💡', name: 'Curioso', earned: true },
      { id: 'finanzas', emoji: '💰', name: 'Financiero', earned: false },
      { id: 'leader', emoji: '👑', name: 'Líder', earned: false },
      { id: 'master', emoji: '🏆', name: 'Maestro', earned: false },
    ]
  },
  {
    id: 'carlos',
    avatar: '👨‍🔧',
    aiTag: 'Asociado nuevo · Perfil introductorio',
    aiDesc: 'Ingresó hace 2 meses. La IA recomienda la ruta de bienvenida obligatoria.',
    profile: { name: 'Carlos Mendoza', cedula: '1.098.234.567', city: 'Medellín', sector: 'Construcción', age: 28, memberSince: 2026, interests: ['Crédito', 'Vivienda'], role: 'Asociado Nuevo' },
    level: 1, xp: 120, streak: 2,
    completedLessons: ['c1-m1-l1'],
    completedModules: [],
    completedCourses: [],
    certificates: [],
    badges: [
      { id: 'first', emoji: '🌟', name: 'Primer Módulo', earned: true },
      { id: 'streak10', emoji: '🔥', name: '10 Días', earned: false },
      { id: 'curious', emoji: '💡', name: 'Curioso', earned: false },
      { id: 'finanzas', emoji: '💰', name: 'Financiero', earned: false },
      { id: 'leader', emoji: '👑', name: 'Líder', earned: false },
      { id: 'master', emoji: '🏆', name: 'Maestro', earned: false },
    ]
  },
  {
    id: 'ana',
    avatar: '👩‍💼',
    aiTag: 'Líder cooperativa · Perfil avanzado',
    aiDesc: 'Miembro del consejo directivo. IA prioriza gobernanza y liderazgo estratégico.',
    profile: { name: 'Ana López', cedula: '1.013.456.789', city: 'Cali', sector: 'Educación', age: 48, memberSince: 2016, interests: ['Liderazgo', 'Gobernanza', 'Inversión'], role: 'Directiva Cooperativa' },
    level: 12, xp: 9450, streak: 30,
    completedLessons: ['c1-m1-l1','c1-m1-l2','c1-m2-l1','c2-m1-l1','c2-m1-l2','c2-m2-l1','c3-m1-l1','c3-m1-l2','c3-m2-l1','c3-m2-l2','c4-m1-l1','c4-m2-l1','c5-m1-l1','c5-m1-l2','c5-m2-l1'],
    completedModules: ['c1-m1','c1-m2','c2-m1','c2-m2','c3-m1','c3-m2','c4-m1','c4-m2','c5-m1','c5-m2'],
    completedCourses: ['c1','c2','c3','c4','c5'],
    certificates: [
      { id: 'cert-a1', courseId: 'c2', courseTitle: '7 Principios Cooperativos', issuedAt: new Date('2025-09-10'), certId: 'IACOOP-2025-A12B', hours: 35, institution: 'Universidad Cooperativa de Colombia' },
      { id: 'cert-a2', courseId: 'c3', courseTitle: 'Crédito Responsable', issuedAt: new Date('2025-11-20'), certId: 'IACOOP-2025-B34C', hours: 45, institution: 'Universidad Cooperativa de Colombia' },
      { id: 'cert-a3', courseId: 'c5', courseTitle: 'Inversión Inteligente', issuedAt: new Date('2026-02-05'), certId: 'IACOOP-2026-C56D', hours: 55, institution: 'Universidad Cooperativa de Colombia' },
    ],
    badges: [
      { id: 'first', emoji: '🌟', name: 'Primer Módulo', earned: true },
      { id: 'streak10', emoji: '🔥', name: '10 Días', earned: true },
      { id: 'curious', emoji: '💡', name: 'Curioso', earned: true },
      { id: 'finanzas', emoji: '💰', name: 'Financiero', earned: true },
      { id: 'leader', emoji: '👑', name: 'Líder', earned: true },
      { id: 'master', emoji: '🏆', name: 'Maestro', earned: false },
    ]
  },
  {
    id: 'pedro',
    avatar: '👨‍💼',
    aiTag: 'Asociado activo · Perfil comercial',
    aiDesc: 'Enfocado en crédito para su negocio. IA detecta oportunidades de ahorro e inversión.',
    profile: { name: 'Pedro García', cedula: '1.070.890.123', city: 'Barranquilla', sector: 'Comercio', age: 42, memberSince: 2021, interests: ['Crédito', 'Microempresa', 'Ahorro'], role: 'Asociado Activo' },
    level: 4, xp: 1890, streak: 5,
    completedLessons: ['c1-m1-l1','c1-m1-l2','c3-m1-l1','c3-m1-l2','c4-m1-l1'],
    completedModules: ['c1-m1','c3-m1'],
    completedCourses: [],
    certificates: [],
    badges: [
      { id: 'first', emoji: '🌟', name: 'Primer Módulo', earned: true },
      { id: 'streak10', emoji: '🔥', name: '10 Días', earned: false },
      { id: 'curious', emoji: '💡', name: 'Curioso', earned: true },
      { id: 'finanzas', emoji: '💰', name: 'Financiero', earned: false },
      { id: 'leader', emoji: '👑', name: 'Líder', earned: false },
      { id: 'master', emoji: '🏆', name: 'Maestro', earned: false },
    ]
  }
]

export const useUserStore = defineStore('user', () => {
  const currentPersonaId = ref<string | null>(null)
  const isLoggedIn = computed(() => currentPersonaId.value !== null)

  const profile = ref({ ...PERSONAS[0].profile })
  const level = ref(PERSONAS[0].level)
  const xp = ref(PERSONAS[0].xp)
  const streak = ref(PERSONAS[0].streak)

  const XP_PER_LEVEL = 800
  const xpForCurrentLevel = computed(() => (level.value - 1) * XP_PER_LEVEL)
  const xpForNextLevel = computed(() => level.value * XP_PER_LEVEL)
  const xpPercent = computed(() =>
    Math.round(((xp.value - xpForCurrentLevel.value) / (xpForNextLevel.value - xpForCurrentLevel.value)) * 100)
  )
  const xpToNext = computed(() => xpForNextLevel.value - xp.value)
  const levelName = computed(() => {
    const names = ['', 'Semilla', 'Brote', 'Aprendiz', 'Estudiante', 'Explorador', 'Conocedor', 'Experto', 'Líder', 'Maestro', 'Leyenda']
    return names[Math.min(level.value, 10)] ?? 'Leyenda'
  })

  const completedLessons = ref<string[]>([...PERSONAS[0].completedLessons])
  const completedModules = ref<string[]>([...PERSONAS[0].completedModules])
  const completedCourses = ref<string[]>([...PERSONAS[0].completedCourses])
  const certificates = ref([...PERSONAS[0].certificates])
  const badges = ref([...PERSONAS[0].badges])

  const currentPersona = computed(() => PERSONAS.find(p => p.id === currentPersonaId.value))

  function loadPersona(id: string) {
    const p = PERSONAS.find(p => p.id === id)
    if (!p) return
    currentPersonaId.value = id
    profile.value = { ...p.profile }
    level.value = p.level
    xp.value = p.xp
    streak.value = p.streak
    completedLessons.value = [...p.completedLessons]
    completedModules.value = [...p.completedModules]
    completedCourses.value = [...p.completedCourses]
    certificates.value = p.certificates.map(c => ({ ...c, issuedAt: new Date(c.issuedAt) }))
    badges.value = p.badges.map(b => ({ ...b }))
  }

  function logout() { currentPersonaId.value = null }

  function addXP(amount: number) {
    xp.value += amount
    while (xp.value >= xpForNextLevel.value) level.value++
  }

  function isLessonDone(id: string) { return completedLessons.value.includes(id) }
  function isModuleDone(id: string) { return completedModules.value.includes(id) }
  function isCourseDone(id: string) { return completedCourses.value.includes(id) }

  function completeLesson(lessonId: string, xpAmt: number) {
    if (isLessonDone(lessonId)) return 0
    completedLessons.value.push(lessonId)
    addXP(xpAmt)
    return xpAmt
  }

  function completeModule(moduleId: string) {
    if (!isModuleDone(moduleId)) completedModules.value.push(moduleId)
  }

  function completeCourse(courseId: string, title: string, hours: number) {
    if (isCourseDone(courseId)) return
    completedCourses.value.push(courseId)
    const certId = `IACOOP-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
    certificates.value.push({ id: `cert-${Date.now()}`, courseId, courseTitle: title, issuedAt: new Date(), certId, hours, institution: 'Universidad Cooperativa de Colombia' })
  }

  return {
    profile, level, xp, streak, levelName,
    xpPercent, xpToNext, xpForNextLevel, xpForCurrentLevel,
    completedLessons, completedModules, completedCourses,
    certificates, badges,
    currentPersonaId, currentPersona, isLoggedIn,
    loadPersona, logout,
    addXP, isLessonDone, isModuleDone, isCourseDone,
    completeLesson, completeModule, completeCourse
  }
})
