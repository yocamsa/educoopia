import { defineStore } from 'pinia'
import { account, databases } from '~/utils/appwrite'

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

const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID || 'main'
const PROFILES_COLLECTION_ID = 'profiles'

const defaultBadges = () => ([
  { id: 'first', emoji: '🌟', name: 'Primer Módulo', earned: false },
  { id: 'streak10', emoji: '🔥', name: '10 Días', earned: false },
  { id: 'curious', emoji: '💡', name: 'Curioso', earned: false },
  { id: 'finanzas', emoji: '💰', name: 'Financiero', earned: false },
  { id: 'leader', emoji: '👑', name: 'Líder', earned: false },
  { id: 'master', emoji: '🏆', name: 'Maestro', earned: false },
])

const createDefaultPersona = (id: string, name = 'Usuario'): Persona => ({
  id,
  avatar: '👤',
  aiTag: 'Asociado nuevo · Perfil introductorio',
  aiDesc: 'Perfil recién creado en la plataforma.',
  profile: {
    name,
    cedula: '',
    city: '',
    sector: '',
    age: 0,
    memberSince: new Date().getFullYear(),
    interests: [],
    role: 'Asociado'
  },
  level: 1,
  xp: 0,
  streak: 0,
  completedLessons: [],
  completedModules: [],
  completedCourses: [],
  certificates: [],
  badges: defaultBadges()
})

const normalizePersona = (raw: any): Persona => {
  const base = createDefaultPersona(raw?.id ?? raw?.$id ?? '')
  
  let parsedCerts = []
  try { parsedCerts = typeof raw.certificates === 'string' ? JSON.parse(raw.certificates) : (raw.certificates || []) } catch (e) {}
  
  let parsedBadges = base.badges
  try { parsedBadges = typeof raw.badges === 'string' ? JSON.parse(raw.badges) : (raw.badges || base.badges) } catch (e) {}

  const certificates = parsedCerts.map((cert: any) => ({
    ...cert,
    issuedAt: cert?.issuedAt ? new Date(cert.issuedAt) : new Date()
  }))

  return {
    id: raw?.id ?? raw?.$id ?? base.id,
    avatar: raw?.avatar ?? base.avatar,
    aiTag: raw?.aiTag ?? base.aiTag,
    aiDesc: raw?.aiDesc ?? base.aiDesc,
    profile: {
      name: raw?.name ?? base.profile.name,
      cedula: raw?.cedula ?? base.profile.cedula,
      city: raw?.city ?? base.profile.city,
      sector: raw?.sector ?? base.profile.sector,
      age: raw?.age ?? base.profile.age,
      memberSince: raw?.memberSince ?? base.profile.memberSince,
      role: raw?.role ?? base.profile.role,
      interests: raw?.interests ?? base.profile.interests
    },
    level: raw?.level ?? base.level,
    xp: raw?.xp ?? base.xp,
    streak: raw?.streak ?? base.streak,
    completedLessons: raw?.completedLessons ?? base.completedLessons,
    completedModules: raw?.completedModules ?? base.completedModules,
    completedCourses: raw?.completedCourses ?? base.completedCourses,
    certificates,
    badges: parsedBadges
  }
}

const serializePersona = (persona: Persona) => ({
  name: persona.profile.name,
  cedula: persona.profile.cedula,
  city: persona.profile.city,
  sector: persona.profile.sector,
  age: persona.profile.age,
  memberSince: persona.profile.memberSince,
  role: persona.profile.role,
  interests: persona.profile.interests,
  level: persona.level,
  xp: persona.xp,
  streak: persona.streak,
  completedLessons: persona.completedLessons,
  completedModules: persona.completedModules,
  completedCourses: persona.completedCourses,
  certificates: JSON.stringify(persona.certificates.map(cert => ({
    ...cert,
    issuedAt: cert.issuedAt instanceof Date ? cert.issuedAt.toISOString() : cert.issuedAt
  }))),
  badges: JSON.stringify(persona.badges)
})

export const useUserStore = defineStore('user', () => {
  const currentPersonaId = ref<string | null>(null)
  const isLoggedIn = computed(() => currentPersonaId.value !== null)

  const initialPersona = createDefaultPersona('')
  const profile = ref({ ...initialPersona.profile })
  const level = ref(initialPersona.level)
  const xp = ref(initialPersona.xp)
  const streak = ref(initialPersona.streak)
  const aiTag = ref(initialPersona.aiTag)
  const aiDesc = ref(initialPersona.aiDesc)
  const avatar = ref(initialPersona.avatar)

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

  const completedLessons = ref<string[]>([...initialPersona.completedLessons])
  const completedModules = ref<string[]>([...initialPersona.completedModules])
  const completedCourses = ref<string[]>([...initialPersona.completedCourses])
  const certificates = ref([...initialPersona.certificates])
  const badges = ref([...initialPersona.badges])

  const currentPersona = computed(() => {
    if (!currentPersonaId.value) return null
    return {
      id: currentPersonaId.value,
      profile: { ...profile.value },
      level: level.value,
      xp: xp.value,
      streak: streak.value,
      completedLessons: [...completedLessons.value],
      completedModules: [...completedModules.value],
      completedCourses: [...completedCourses.value],
      certificates: certificates.value.map(cert => ({ ...cert })),
      badges: badges.value.map(badge => ({ ...badge })),
      aiTag: aiTag.value,
      aiDesc: aiDesc.value,
      avatar: avatar.value
    }
  })

  function applyPersona(persona: Persona) {
    currentPersonaId.value = persona.id
    profile.value = { ...persona.profile }
    level.value = persona.level
    xp.value = persona.xp
    streak.value = persona.streak
    completedLessons.value = [...persona.completedLessons]
    completedModules.value = [...persona.completedModules]
    completedCourses.value = [...persona.completedCourses]
    certificates.value = persona.certificates.map(c => ({ ...c, issuedAt: new Date(c.issuedAt) }))
    badges.value = persona.badges.map(b => ({ ...b }))
    aiTag.value = persona.aiTag
    aiDesc.value = persona.aiDesc
    avatar.value = persona.avatar
  }

  function isNotFoundError(error: any) {
    return error?.code === 404 || error?.type === 'document_not_found'
  }

  async function fetchProfile(userId?: string) {
    let resolvedId = userId
    let authUser: any = null

    try {
      authUser = await account.get()
      resolvedId = authUser?.$id ?? resolvedId
    } catch (error) {
      if (!resolvedId) throw error
    }

    if (!resolvedId) return
    currentPersonaId.value = resolvedId

    try {
      const doc = await databases.getDocument(DB_ID, PROFILES_COLLECTION_ID, resolvedId)
      const persona = normalizePersona({ ...doc, id: doc.$id })
      applyPersona(persona)
    } catch (error: any) {
      if (!isNotFoundError(error)) throw error
      const persona = createDefaultPersona(resolvedId, authUser?.name || 'Usuario')
      const payload = serializePersona(persona)
      console.log('Payload a enviar a Appwrite:', payload) // Para depurar en la consola
      const doc = await databases.createDocument(DB_ID, PROFILES_COLLECTION_ID, resolvedId, payload)
      applyPersona(normalizePersona({ ...doc, id: doc.$id }))
    }
  }

  async function loadPersona(id?: string) {
    await fetchProfile(id)
  }

  function logout() { currentPersonaId.value = null }

  function addXP(amount: number) {
    xp.value += amount
    while (xp.value >= xpForNextLevel.value) level.value++
  }

  function isLessonDone(id: string) { return completedLessons.value.includes(id) }
  function isModuleDone(id: string) { return completedModules.value.includes(id) }
  function isCourseDone(id: string) { return completedCourses.value.includes(id) }

  async function persistProfile() {
    if (!currentPersonaId.value) return
    const payload = serializePersona({
      id: currentPersonaId.value,
      profile: { ...profile.value },
      level: level.value,
      xp: xp.value,
      streak: streak.value,
      completedLessons: [...completedLessons.value],
      completedModules: [...completedModules.value],
      completedCourses: [...completedCourses.value],
      certificates: certificates.value.map(cert => ({ ...cert })),
      badges: badges.value.map(badge => ({ ...badge })),
      aiTag: aiTag.value,
      aiDesc: aiDesc.value,
      avatar: avatar.value
    })
    await databases.updateDocument(DB_ID, PROFILES_COLLECTION_ID, currentPersonaId.value, payload)
  }

  async function completeLesson(lessonId: string, xpAmt: number) {
    if (isLessonDone(lessonId)) return 0
    completedLessons.value.push(lessonId)
    addXP(xpAmt)
    await persistProfile()
    return xpAmt
  }

  async function completeModule(moduleId: string) {
    if (isModuleDone(moduleId)) return
    completedModules.value.push(moduleId)
    await persistProfile()
  }

  async function completeCourse(courseId: string, title: string, hours: number) {
    if (isCourseDone(courseId)) return
    completedCourses.value.push(courseId)
    const certId = `IACOOP-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
    certificates.value.push({ id: `cert-${Date.now()}`, courseId, courseTitle: title, issuedAt: new Date(), certId, hours, institution: 'Universidad Cooperativa de Colombia' })
    await persistProfile()
  }

  return {
    profile, level, xp, streak, levelName,
    xpPercent, xpToNext, xpForNextLevel, xpForCurrentLevel,
    completedLessons, completedModules, completedCourses,
    certificates, badges,
    aiTag, aiDesc, avatar,
    currentPersonaId, currentPersona, isLoggedIn,
    loadPersona, fetchProfile, logout,
    addXP, isLessonDone, isModuleDone, isCourseDone,
    completeLesson, completeModule, completeCourse
  }
})
