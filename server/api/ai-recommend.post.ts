export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.deepseekApiKey || process.env.NUXT_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'DEEPSEEK_API_KEY not configured' })
  }

  const body = await readBody(event)
  const { profile, completedCourses, completedLessons, availableCourses } = body

  const prompt = `Eres el motor de personalización de IA-COOP, una plataforma educativa para cooperativas colombianas.

Perfil del asociado:
- Nombre: ${profile.name}
- Sector: ${profile.sector}
- Rol: ${profile.role}
- Ciudad: ${profile.city}
- Nivel: ${profile.level} (${profile.levelName})
- XP acumulada: ${profile.xp}
- Racha actual: ${profile.streak} días
- Intereses: ${profile.interests.join(', ')}
- Miembro desde: ${profile.memberSince}

Progreso:
- Cursos completados: ${completedCourses.length > 0 ? completedCourses.join(', ') : 'ninguno'}
- Lecciones completadas: ${completedLessons}

Cursos disponibles (no completados):
${availableCourses.map((c: any) => `- [${c.id}] ${c.title} (${c.category}, ${c.duration} min)`).join('\n')}

Genera un análisis personalizado y responde SOLO con JSON válido con esta estructura exacta:
{
  "greeting": "saludo corto y motivador de 1 frase, personalizado con el nombre y rol del usuario",
  "analysis": "análisis breve del perfil en 2-3 frases, mencionando fortalezas y oportunidades de crecimiento según su sector e intereses",
  "recommendations": [
    {"courseId": "id", "reason": "razón específica de 1 frase por qué este curso es ideal para este usuario", "match": 95}
  ],
  "gaps": ["brecha de conocimiento 1", "brecha de conocimiento 2"],
  "tip": "consejo práctico del día relacionado con cooperativismo o finanzas personales, 1-2 frases"
}

Reglas:
- Recomienda exactamente 3 cursos de la lista de disponibles, ordenados por relevancia
- El match debe estar entre 75 y 99
- Usa "tú" informal, tono cálido y motivador
- Responde en español colombiano
- SOLO JSON, sin texto adicional`

  const response = await $fetch<any>('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 800,
    },
  })

  const raw = response.choices?.[0]?.message?.content ?? '{}'
  return JSON.parse(raw)
})
