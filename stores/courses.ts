import { defineStore } from 'pinia'

export interface Lesson {
  id: string; title: string; content: string; duration: number; xp: number
}
export interface QuizQuestion {
  q: string; opts: string[]; answer: number
}
export interface Module {
  id: string; title: string; lessons: Lesson[]; quiz: QuizQuestion[]
}
export interface Course {
  id: string; title: string; description: string;
  category: string; level: 'basico' | 'intermedio' | 'avanzado';
  duration: number; totalXP: number; emoji: string; certificate: boolean;
  modules: Module[]
}

export const useCoursesStore = defineStore('courses', () => {
  const courses: Course[] = [
    {
      id: 'c1', emoji: '🏛️',
      title: '¿Qué es una Cooperativa?',
      description: 'Descubre los orígenes, definición y tipos de cooperativas. El punto de partida para todo asociado nuevo.',
      category: 'Principios', level: 'basico', duration: 25, totalXP: 320, certificate: false,
      modules: [
        {
          id: 'c1-m1', title: 'Historia del Movimiento Cooperativo',
          lessons: [
            {
              id: 'c1-m1-l1', title: 'Orígenes en Rochdale', duration: 10, xp: 80,
              content: `<p class="lead">El movimiento cooperativo nació como respuesta a las condiciones laborales precarias de la Revolución Industrial en el siglo XIX.</p>
<div class="key-concept"><strong>Hecho histórico:</strong> Los <em>Pioneros de Rochdale</em>, un grupo de 28 trabajadores textiles, fundaron en 1844 la primera cooperativa moderna en Rochdale, Inglaterra. Cada socio aportó 1 libra esterlina para abrir una tienda de alimentos.</div>
<p>Ante los bajos salarios y la adulteración de los alimentos, estos trabajadores decidieron unir sus recursos bajo un modelo democrático: <strong>un socio, un voto</strong>, sin importar el capital aportado.</p>
<p>Su modelo se difundió rápidamente por Europa y luego al mundo entero. Hoy existen más de <strong>3 millones de cooperativas</strong> en más de 100 países, con cerca de <strong>1.200 millones de socios</strong>.</p>
<div class="callout"><strong>💡 Recuerda:</strong> Una cooperativa NO es una empresa caritativa ni estatal. Es una empresa privada, propiedad y control de sus propios asociados, que democratiza la economía.</div>`
            },
            {
              id: 'c1-m1-l2', title: 'Las Cooperativas en Colombia', duration: 10, xp: 80,
              content: `<p class="lead">Colombia tiene una de las historias cooperativas más ricas de América Latina, con más de un siglo de desarrollo del sector solidario.</p>
<div class="key-concept"><strong>Dato nacional:</strong> La primera cooperativa en Colombia se fundó en <strong>1916</strong> en el departamento de Nariño. Hoy el sector solidario colombiano mueve más de <strong>50 billones de pesos</strong> anuales.</div>
<h3>El sector solidario colombiano</h3>
<p>En Colombia, las cooperativas hacen parte del llamado <strong>sector solidario</strong>, junto con las mutuales, fondos de empleados y asociaciones de trabajo asociado. Son vigiladas por la <em>Superintendencia de la Economía Solidaria (Supersolidaria)</em>.</p>
<ul>
<li><strong>Cooperativas financieras:</strong> Ofrecen servicios de ahorro y crédito</li>
<li><strong>Cooperativas de trabajo asociado:</strong> Los socios son también los trabajadores</li>
<li><strong>Cooperativas de consumo:</strong> Adquieren bienes para sus asociados</li>
<li><strong>Cooperativas multiactivas:</strong> Combinan varias actividades</li>
</ul>
<div class="callout"><strong>💡 Curiosidad:</strong> Existen más de <strong>8.500 cooperativas activas</strong> en Colombia, con presencia en todos los departamentos del país.</div>`
            }
          ],
          quiz: [
            { q: '¿En qué año se fundó la primera cooperativa moderna?', opts: ['1844', '1917', '1789', '1900'], answer: 0 },
            { q: '¿Cuál es el principio democrático fundamental de las cooperativas?', opts: ['Un socio, un voto', 'Un peso, un voto', 'Un cargo, un voto', 'Un año, un voto'], answer: 0 },
            { q: '¿Qué entidad vigila las cooperativas en Colombia?', opts: ['Supersolidaria', 'Superfinanciera', 'DIAN', 'Bancóldex'], answer: 0 }
          ]
        },
        {
          id: 'c1-m2', title: 'Definición y Valores Cooperativos',
          lessons: [
            {
              id: 'c1-m2-l1', title: 'Valores que nos distinguen', duration: 10, xp: 80,
              content: `<p class="lead">Las cooperativas se guían por valores propios que las diferencian radicalmente de las empresas tradicionales.</p>
<div class="key-concept"><strong>Definición ICA:</strong> "Una cooperativa es una asociación autónoma de personas que se han unido voluntariamente para hacer frente a sus necesidades y aspiraciones económicas, sociales y culturales comunes, por medio de una empresa de propiedad conjunta y democráticamente controlada."</div>
<h3>Los valores cooperativos</h3>
<p>Según la Alianza Cooperativa Internacional (ACI), los valores cooperativos son:</p>
<ul>
<li>🤝 <strong>Ayuda mutua:</strong> Trabajamos juntos para lograr lo que individualmente es difícil</li>
<li>🫱 <strong>Responsabilidad:</strong> Cada socio asume compromisos con la cooperativa</li>
<li>🗳️ <strong>Democracia:</strong> Decisiones colectivas con igualdad de voto</li>
<li>⚖️ <strong>Igualdad:</strong> Todos los socios tienen los mismos derechos básicos</li>
<li>🌿 <strong>Equidad:</strong> Distribución justa de beneficios</li>
<li>🤲 <strong>Solidaridad:</strong> Apoyo a los socios y a la comunidad</li>
</ul>
<div class="callout"><strong>💡 Para reflexionar:</strong> En una cooperativa, TÚ eres dueño, usuario y gobernante al mismo tiempo. Esa triple condición es lo que hace únicas a las cooperativas.</div>`
            }
          ],
          quiz: [
            { q: '¿Qué triple condición tienen los asociados en una cooperativa?', opts: ['Dueño, usuario y gobernante', 'Empleado, cliente y accionista', 'Socio, director y auditor', 'Ninguna de las anteriores'], answer: 0 },
            { q: '¿Cuál es la sigla de la organización mundial del cooperativismo?', opts: ['ACI', 'OIT', 'ONG', 'BID'], answer: 0 },
            { q: '¿Cuál valor cooperativo hace referencia a la distribución justa de beneficios?', opts: ['Equidad', 'Democracia', 'Igualdad', 'Solidaridad'], answer: 0 }
          ]
        }
      ]
    },
    {
      id: 'c2', emoji: '📜',
      title: '7 Principios Cooperativos',
      description: 'Los principios que guían a todas las cooperativas del mundo, adaptados al contexto colombiano.',
      category: 'Principios', level: 'basico', duration: 40, totalXP: 450, certificate: true,
      modules: [
        {
          id: 'c2-m1', title: 'Principios 1 al 4',
          lessons: [
            {
              id: 'c2-m1-l1', title: 'Adhesión voluntaria y control democrático', duration: 15, xp: 100,
              content: `<p class="lead">Los primeros dos principios establecen quién puede ser socio y cómo se toman las decisiones.</p>
<div class="key-concept"><strong>1er Principio — Adhesión Voluntaria y Abierta:</strong> Las cooperativas son organizaciones voluntarias, abiertas a todas las personas capaces de utilizar sus servicios y dispuestas a aceptar las responsabilidades de ser socias.</div>
<p>Este principio prohíbe la discriminación por género, raza, clase social, posición política o religiosa. Sin embargo, las cooperativas pueden tener requisitos legítimos para el ingreso (como pertenecer a un sector específico).</p>
<div class="key-concept"><strong>2do Principio — Control Democrático de los Socios:</strong> Las cooperativas son organizaciones democráticas controladas por sus socios. En las cooperativas de primer grado, los socios tienen igual derecho de voto: un socio = un voto.</div>
<p>Las grandes decisiones se toman en la <strong>Asamblea General</strong>, donde cada asociado tiene exactamente el mismo peso que los demás, sin importar cuánto dinero tenga invertido.</p>
<div class="callout"><strong>💡 Diferencia clave:</strong> En una sociedad anónima (SA), quien más acciones tiene, más vota. En una cooperativa, todos votan igual. Esto es la democracia económica en acción.</div>`
            },
            {
              id: 'c2-m1-l2', title: 'Participación económica y autonomía', duration: 15, xp: 100,
              content: `<p class="lead">Los principios 3 y 4 definen cómo se manejan los recursos y la independencia de la cooperativa.</p>
<div class="key-concept"><strong>3er Principio — Participación Económica:</strong> Los socios contribuyen equitativamente al capital de la cooperativa y lo gestionan de forma democrática. Los excedentes pueden destinarse a: reservas, servicios a los socios, o actividades comunitarias.</div>
<p>A diferencia de las empresas ordinarias que buscan maximizar dividendos para accionistas externos, las cooperativas reinvierten sus excedentes en <strong>beneficios para sus propios socios</strong> y en la comunidad.</p>
<div class="key-concept"><strong>4to Principio — Autonomía e Independencia:</strong> Las cooperativas son organizaciones autónomas de ayuda mutua, controladas por sus socios. Si entran en acuerdos con otras organizaciones (incluyendo el Estado), lo hacen en términos que aseguren el control democrático por parte de sus socios.</div>
<div class="callout"><strong>💡 Importante:</strong> La autonomía no significa aislamiento. Las cooperativas pueden colaborar con el Estado y empresas privadas, pero manteniendo siempre su independencia y valores cooperativos.</div>`
            }
          ],
          quiz: [
            { q: '¿Qué prohíbe el principio de adhesión voluntaria?', opts: ['Discriminar a posibles socios', 'Tener requisitos de ingreso', 'Cobrar cuotas de membresía', 'Limitar el número de socios'], answer: 0 },
            { q: '¿En qué instancia se ejercen los derechos democráticos de los socios?', opts: ['Asamblea General', 'Junta Directiva', 'Comité de Control', 'Gerencia'], answer: 0 },
            { q: '¿Cómo se llaman los beneficios económicos de una cooperativa?', opts: ['Excedentes', 'Dividendos', 'Ganancias', 'Rentabilidad'], answer: 0 }
          ]
        },
        {
          id: 'c2-m2', title: 'Principios 5 al 7',
          lessons: [
            {
              id: 'c2-m2-l1', title: 'Educación, cooperación e interés comunitario', duration: 15, xp: 100,
              content: `<p class="lead">Los últimos tres principios conectan la cooperativa con el aprendizaje continuo, la red global cooperativa y la comunidad.</p>
<div class="key-concept"><strong>5to Principio — Educación, Formación e Información:</strong> Las cooperativas brindan educación y formación a sus socios, dirigentes, gestores y empleados para que puedan contribuir de forma eficaz al desarrollo de sus cooperativas. <em>¡Este es precisamente el propósito de IA-COOP!</em></div>
<p>Las cooperativas informan al público en general, especialmente a jóvenes y líderes de opinión, sobre la naturaleza y beneficios de la cooperación.</p>
<div class="key-concept"><strong>6to Principio — Cooperación entre Cooperativas:</strong> Las cooperativas sirven a sus socios más eficazmente y fortalecen el movimiento cooperativo trabajando conjuntamente mediante estructuras locales, nacionales, regionales e internacionales.</div>
<div class="key-concept"><strong>7mo Principio — Interés por la Comunidad:</strong> Las cooperativas trabajan para conseguir el desarrollo sostenible de sus comunidades mediante políticas aprobadas por sus socios.</div>
<div class="callout"><strong>💡 Conexión:</strong> Los 7 principios no son normas aisladas — forman un sistema coherente. La educación (P5) permite la participación democrática (P2), que a su vez garantiza el control autónomo (P4) en beneficio de la comunidad (P7).</div>`
            }
          ],
          quiz: [
            { q: '¿Qué principio justifica la existencia de plataformas como IA-COOP?', opts: ['Educación, formación e información', 'Control democrático', 'Adhesión voluntaria', 'Autonomía'], answer: 0 },
            { q: '¿Cuántos principios cooperativos reconoce la ACI internacionalmente?', opts: ['7', '5', '10', '12'], answer: 0 },
            { q: '¿Qué busca el 7mo principio cooperativo?', opts: ['Desarrollo sostenible de la comunidad', 'Maximizar excedentes', 'Expandir la membresía', 'Internacionalización'], answer: 0 }
          ]
        }
      ]
    },
    {
      id: 'c3', emoji: '💳',
      title: 'Crédito Responsable',
      description: 'Entiende cómo funciona el crédito cooperativo, aprende a usarlo inteligentemente y protege tu salud financiera.',
      category: 'Finanzas', level: 'intermedio', duration: 50, totalXP: 550, certificate: true,
      modules: [
        {
          id: 'c3-m1', title: 'Fundamentos del Crédito',
          lessons: [
            {
              id: 'c3-m1-l1', title: '¿Qué es el crédito y cómo funciona?', duration: 15, xp: 100,
              content: `<p class="lead">El crédito es una herramienta financiera poderosa: bien usada, impulsa tu bienestar; mal usada, puede generar graves problemas económicos.</p>
<div class="key-concept"><strong>Definición:</strong> El crédito es un contrato donde una entidad (acreedor) entrega dinero a una persona (deudor) con la promesa de reembolsarlo en el futuro, más un interés como costo del servicio.</div>
<h3>Componentes de un crédito</h3>
<ul>
<li>💵 <strong>Capital:</strong> El monto principal que pides prestado</li>
<li>📅 <strong>Plazo:</strong> El tiempo que tienes para devolver el dinero</li>
<li>% <strong>Tasa de interés:</strong> El costo del dinero prestado (expresado en EA o mensual)</li>
<li>💳 <strong>Cuota:</strong> El pago periódico que incluye abono a capital + intereses</li>
</ul>
<h3>¿Cómo se diferencia el crédito cooperativo?</h3>
<p>En una cooperativa, los intereses pagados por los deudores no van a accionistas externos: <strong>se quedan en la cooperativa y benefician a todos los socios</strong>, incluyendo a ti mismo. Además, las tasas cooperativas suelen ser más bajas que las de bancos comerciales.</p>
<div class="callout"><strong>💡 Recuerda:</strong> En la cooperativa, cuando pagas intereses, en parte te los pagas a ti mismo como socio. Cada pago fortalece el fondo que beneficia a toda la comunidad.</div>`
            },
            {
              id: 'c3-m1-l2', title: 'Tipos de crédito en la cooperativa', duration: 12, xp: 80,
              content: `<p class="lead">La cooperativa ofrece diferentes modalidades de crédito diseñadas para distintas necesidades de los asociados.</p>
<div class="highlight-box">
<h3>📋 Líneas de crédito típicas</h3>
<ul>
<li>🏠 <strong>Crédito de vivienda:</strong> Para compra, mejora o construcción. Plazos hasta 20 años.</li>
<li>🎓 <strong>Crédito educativo:</strong> Para estudios propios o de familiares. Tasas preferenciales.</li>
<li>🚗 <strong>Crédito de vehículo:</strong> Adquisición de vehículo nuevo o usado.</li>
<li>🏥 <strong>Crédito de calamidad:</strong> Para emergencias de salud. Desembolso rápido.</li>
<li>💼 <strong>Crédito libre inversión:</strong> Para cualquier propósito. El más flexible.</li>
<li>🌱 <strong>Microcrédito:</strong> Para emprendimientos y proyectos productivos.</li>
</ul>
</div>
<p>Cada línea tiene condiciones específicas de tasa, plazo y requisitos. Es fundamental <strong>elegir la línea adecuada</strong> para tu necesidad, ya que afecta directamente el costo total del crédito.</p>
<div class="callout"><strong>💡 Consejo:</strong> Antes de solicitar un crédito, visita tu asesor cooperativo y compara las diferentes líneas. Una diferencia del 1% en la tasa puede significar cientos de miles de pesos en el plazo total.</div>`
            }
          ],
          quiz: [
            { q: '¿Qué representa la tasa EA en un crédito?', opts: ['La tasa efectiva anual — el costo real del crédito en un año', 'El monto máximo que puedes pedir', 'La cuota mensual del crédito', 'El seguro del crédito'], answer: 0 },
            { q: '¿Qué sucede con los intereses pagados en una cooperativa?', opts: ['Benefician a todos los socios', 'Van a accionistas externos', 'Se entregan al Estado', 'Los retiene el gerente'], answer: 0 },
            { q: '¿Cuál línea de crédito es ideal para una emergencia médica?', opts: ['Crédito de calamidad', 'Libre inversión', 'Microcrédito', 'Crédito educativo'], answer: 0 }
          ]
        },
        {
          id: 'c3-m2', title: 'Uso Inteligente del Crédito',
          lessons: [
            {
              id: 'c3-m2-l1', title: 'Capacidad de endeudamiento', duration: 15, xp: 100,
              content: `<p class="lead">Conocer tu capacidad de endeudamiento es el primer paso para usar el crédito de forma responsable y evitar el sobreendeudamiento.</p>
<div class="key-concept"><strong>Regla del 30%:</strong> La suma de todas tus cuotas de crédito NO debería superar el <strong>30% de tus ingresos netos mensuales</strong>. Este es el límite recomendado por expertos financieros.</div>
<h3>¿Cómo calcular tu capacidad?</h3>
<p>Ejemplo: Si tu salario neto es $2.500.000:</p>
<div class="highlight-box">
<p>✅ Máximo recomendado en cuotas: <strong>$750.000/mes</strong></p>
<p>Si ya tienes una cuota de $300.000, solo puedes asumir <strong>$450.000 más</strong>.</p>
</div>
<p>Antes de pedir cualquier crédito, haz este ejercicio:</p>
<ol>
<li>Suma todos tus ingresos mensuales netos</li>
<li>Multiplica por 0.30 → ese es tu techo</li>
<li>Resta las cuotas que ya tienes</li>
<li>La diferencia es tu capacidad disponible</li>
</ol>
<div class="callout"><strong>⚠️ Señal de alarma:</strong> Si estás usando un crédito para pagar otro crédito, es una señal de sobreendeudamiento. Habla con tu asesor cooperativo lo antes posible.</div>`
            },
            {
              id: 'c3-m2-l2', title: 'Historial crediticio y centrales de riesgo', duration: 12, xp: 80,
              content: `<p class="lead">Tu historial crediticio es tu carta de presentación financiera. Entender cómo funciona te permite cuidarlo y mejorar tu acceso al crédito.</p>
<div class="key-concept"><strong>Centrales de riesgo:</strong> Son bases de datos que recopilan información sobre el comportamiento de pago de todas las personas. En Colombia las principales son <em>DataCrédito (Experian)</em> y <em>TransUnion</em>.</div>
<h3>¿Qué reportan?</h3>
<ul>
<li>✅ Pagos puntuales (reporte positivo)</li>
<li>❌ Pagos tardíos o incumplidos (reporte negativo)</li>
<li>📊 Montos de deuda actuales</li>
<li>🔍 Consultas recientes de crédito</li>
</ul>
<p>Un buen historial crediticio te permite acceder a <strong>mejores tasas, mayores montos y plazos más flexibles</strong>. Un mal historial puede cerrar puertas no solo en la cooperativa sino en otros servicios financieros.</p>
<div class="callout"><strong>💡 Tip de oro:</strong> Paga siempre antes de la fecha de corte, aunque sea el mínimo. Un solo pago tarde puede manchar tu historial por hasta 4 años. La puntualidad vale más que el monto pagado.</div>`
            }
          ],
          quiz: [
            { q: '¿Qué porcentaje de tus ingresos se recomienda destinar máximo a cuotas de crédito?', opts: ['30%', '50%', '20%', '40%'], answer: 0 },
            { q: '¿Cuál es una señal de sobreendeudamiento?', opts: ['Usar un crédito para pagar otro', 'Tener más de un crédito activo', 'Pedir crédito para vivienda', 'Ahorrar mientras pagas crédito'], answer: 0 },
            { q: '¿Por cuánto tiempo puede afectar un pago tardío tu historial crediticio?', opts: ['Hasta 4 años', 'Solo 6 meses', 'Para siempre', '1 año exacto'], answer: 0 }
          ]
        }
      ]
    },
    {
      id: 'c4', emoji: '🐷',
      title: 'Hábitos de Ahorro',
      description: 'Desarrolla una cultura de ahorro efectiva con estrategias probadas y aprovecha los productos cooperativos.',
      category: 'Finanzas', level: 'basico', duration: 35, totalXP: 380, certificate: false,
      modules: [
        {
          id: 'c4-m1', title: 'Cultura del Ahorro',
          lessons: [
            {
              id: 'c4-m1-l1', title: '¿Por qué ahorrar en la cooperativa?', duration: 15, xp: 100,
              content: `<p class="lead">El ahorro es la base de la libertad financiera. Ahorrar en tu cooperativa no solo protege tu dinero, sino que también fortalece a toda la comunidad cooperativa.</p>
<div class="key-concept"><strong>Diferencia clave:</strong> Cuando ahorras en un banco comercial, tu dinero genera utilidades para accionistas ajenos. Cuando ahorras en la cooperativa, generas excedentes que regresan a ti y a tus compañeros asociados.</div>
<h3>Ventajas del ahorro cooperativo</h3>
<ul>
<li>📈 <strong>Mejores tasas:</strong> Generalmente superiores a la banca tradicional</li>
<li>🔒 <strong>Seguridad:</strong> Vigilados por Supersolidaria con fondos de garantía</li>
<li>🤝 <strong>Solidaridad:</strong> Tu ahorro financia los créditos de otros socios</li>
<li>💳 <strong>Acceso a crédito:</strong> Un historial de ahorro facilita el acceso a créditos mayores</li>
<li>🌱 <strong>Cultura:</strong> Construyes el hábito que protege tu futuro</li>
</ul>
<p>En Colombia, los ahorros en cooperativas financieras están protegidos por el <em>Fondo de Garantías del Sector Solidario (Fogacoop)</em>, similar al Fogafín de la banca comercial.</p>
<div class="callout"><strong>💡 Principio del ahorro:</strong> No ahorres lo que sobra después de gastar. Gasta lo que sobra después de ahorrar. Este simple cambio mental transforma las finanzas personales.</div>`
            }
          ],
          quiz: [
            { q: '¿Qué entidad protege los ahorros en cooperativas colombianas?', opts: ['Fogacoop', 'Fogafín', 'Superfinanciera', 'Banco de la República'], answer: 0 },
            { q: '¿Cuál es el principio del ahorro inteligente?', opts: ['Ahorrar primero, gastar lo que sobre', 'Ahorrar lo que sobre del gasto', 'No ahorrar si tienes deudas', 'Ahorrar solo cuando hay excedentes'], answer: 0 },
            { q: '¿Cómo beneficia a la comunidad cuando ahorras en la cooperativa?', opts: ['Financia créditos de otros socios', 'Solo te beneficia a ti', 'Va a reservas del Estado', 'Paga salarios de empleados'], answer: 0 }
          ]
        },
        {
          id: 'c4-m2', title: 'Estrategias de Ahorro',
          lessons: [
            {
              id: 'c4-m2-l1', title: 'La regla 50/30/20 y más', duration: 15, xp: 100,
              content: `<p class="lead">Existen métodos probados para organizar tus finanzas personales y construir el hábito del ahorro de forma sostenible.</p>
<div class="key-concept"><strong>Regla 50/30/20:</strong> Divide tus ingresos netos así: <strong>50%</strong> para necesidades básicas (vivienda, comida, servicios) · <strong>30%</strong> para deseos (entretenimiento, ropa, restaurantes) · <strong>20%</strong> para ahorro e inversión.</div>
<h3>Otras estrategias efectivas</h3>
<ul>
<li>🤖 <strong>Ahorro automático:</strong> Programa una transferencia automática el día de pago. Si no lo ves, no lo gastas.</li>
<li>🏦 <strong>Cuenta separada:</strong> Ten una cuenta de ahorros separada de tu cuenta corriente. La distancia psicológica ayuda.</li>
<li>🎯 <strong>Ahorro por metas:</strong> Asigna nombre a tus ahorros: "Vacaciones 2027", "Fondo de emergencia", "Cuota inicial apartamento".</li>
<li>💰 <strong>Ahorro de los excesos:</strong> Cada vez que no gastes algo que habías presupuestado, transfiere ese dinero al ahorro.</li>
</ul>
<h3>Fondo de emergencia: tu red de seguridad</h3>
<p>Antes de cualquier meta de ahorro, construye un <strong>fondo de emergencia de 3 a 6 meses de gastos</strong>. Este fondo evita que tengas que endeudarte ante imprevistos.</p>
<div class="callout"><strong>💡 Meta 1:</strong> Empieza hoy. Así sea con $50.000 al mes. El hábito importa más que el monto. Con el tiempo, el ahorro crece y la satisfacción de verlo crecer te motiva a ahorrar más.</div>`
            }
          ],
          quiz: [
            { q: '¿Qué porcentaje de ingresos recomienda la regla 50/30/20 para ahorro?', opts: ['20%', '30%', '50%', '10%'], answer: 0 },
            { q: '¿Cuántos meses de gastos debe tener un fondo de emergencia ideal?', opts: ['3 a 6 meses', '1 mes', '12 meses', '2 semanas'], answer: 0 },
            { q: '¿Por qué es útil el ahorro automático programado?', opts: ['Porque si no lo ves, no lo gastas', 'Porque genera más intereses', 'Porque es obligatorio por ley', 'Porque lo administra la cooperativa'], answer: 0 }
          ]
        }
      ]
    },
    {
      id: 'c5', emoji: '📈',
      title: 'Inversión Inteligente',
      description: 'Aprende a invertir tu dinero en los productos cooperativos para hacerlo crecer con el nivel de riesgo adecuado a tu perfil.',
      category: 'Finanzas', level: 'avanzado', duration: 60, totalXP: 650, certificate: true,
      modules: [
        {
          id: 'c5-m1', title: 'Fundamentos de Inversión',
          lessons: [
            {
              id: 'c5-m1-l1', title: 'Riesgo y rentabilidad', duration: 18, xp: 130,
              content: `<p class="lead">Toda inversión implica una relación entre riesgo y rentabilidad. Entender esta relación es el primer paso para invertir con inteligencia.</p>
<div class="key-concept"><strong>Principio universal:</strong> A mayor riesgo, mayor rentabilidad potencial. No existe inversión con alta rentabilidad y cero riesgo. Si alguien te ofrece eso, es una señal de fraude.</div>
<h3>Tipos de riesgo en inversiones</h3>
<ul>
<li>📉 <strong>Riesgo de mercado:</strong> El valor puede bajar por condiciones económicas</li>
<li>🏦 <strong>Riesgo de crédito:</strong> El emisor podría no cumplir con los pagos</li>
<li>💧 <strong>Riesgo de liquidez:</strong> Puede ser difícil convertir la inversión en efectivo rápidamente</li>
<li>📊 <strong>Riesgo de inflación:</strong> La rentabilidad podría no superar la inflación</li>
</ul>
<h3>El tiempo como aliado</h3>
<p>El <strong>interés compuesto</strong> es la fuerza más poderosa en las finanzas. Albert Einstein lo llamó "la octava maravilla del mundo". Cuando los intereses generan más intereses, el crecimiento es exponencial con el tiempo.</p>
<div class="highlight-box">
<p>Ejemplo: $1.000.000 invertidos al 10% EA:</p>
<p>📅 En 5 años: <strong>$1.610.510</strong></p>
<p>📅 En 10 años: <strong>$2.593.742</strong></p>
<p>📅 En 20 años: <strong>$6.727.500</strong></p>
</div>
<div class="callout"><strong>💡 Conclusión:</strong> Empieza a invertir temprano. El tiempo en el mercado supera casi siempre al mejor momento para entrar al mercado.</div>`
            },
            {
              id: 'c5-m1-l2', title: 'Tu perfil de inversionista', duration: 12, xp: 90,
              content: `<p class="lead">Cada persona tiene un perfil de riesgo diferente. Conocer el tuyo es esencial para elegir inversiones adecuadas y no tomar decisiones que te quiten el sueño.</p>
<div class="key-concept"><strong>Perfil conservador:</strong> Priorizas la seguridad sobre la rentabilidad. Toleras poca variación en el valor de tu inversión. Ideal: cuentas de ahorro, CDT.</div>
<div class="key-concept"><strong>Perfil moderado:</strong> Buscas equilibrio entre seguridad y crecimiento. Puedes tolerar algo de variación. Ideal: mezcla de CDT y fondos de inversión.</div>
<div class="key-concept"><strong>Perfil agresivo:</strong> Buscas la mayor rentabilidad posible y aceptas alta variabilidad. Horizonte de inversión largo (10+ años). Ideal: fondos de renta variable, acciones.</div>
<h3>¿Qué define tu perfil?</h3>
<ul>
<li>⏰ <strong>Horizonte temporal:</strong> ¿Cuándo necesitas el dinero?</li>
<li>😰 <strong>Tolerancia al riesgo:</strong> ¿Cómo reaccionas si tu inversión baja un 20%?</li>
<li>💼 <strong>Situación financiera:</strong> ¿Tienes fondo de emergencia? ¿Otras deudas?</li>
<li>🎯 <strong>Objetivo:</strong> ¿Para qué estás invirtiendo?</li>
</ul>
<div class="callout"><strong>💡 Regla práctica:</strong> Nunca inviertas dinero que puedas necesitar en los próximos 12 meses en productos con riesgo. Ese dinero debe estar en ahorro a la vista o CDT de corto plazo.</div>`
            }
          ],
          quiz: [
            { q: '¿Qué garantiza una inversión de alta rentabilidad y cero riesgo?', opts: ['Que es un fraude o engaño', 'Que es producto cooperativo', 'Que tiene garantía estatal', 'Que es a muy largo plazo'], answer: 0 },
            { q: '¿Qué perfil de inversión es adecuado para quien no puede tolerar pérdidas?', opts: ['Conservador', 'Moderado', 'Agresivo', 'Especulativo'], answer: 0 },
            { q: '¿Cómo se llama el fenómeno donde los intereses generan más intereses?', opts: ['Interés compuesto', 'Amortización', 'Capitalización simple', 'Rendimiento nominal'], answer: 0 }
          ]
        },
        {
          id: 'c5-m2', title: 'Productos Cooperativos de Inversión',
          lessons: [
            {
              id: 'c5-m2-l1', title: 'CDT y cuentas de ahorro', duration: 15, xp: 110,
              content: `<p class="lead">Las cooperativas financieras ofrecen productos de inversión competitivos y seguros que se adaptan a todos los perfiles.</p>
<div class="key-concept"><strong>CDT Cooperativo (Certificado de Depósito a Término):</strong> Inviertes un monto fijo por un período determinado (30 a 360 días o más) a una tasa acordada desde el inicio. Es renta fija: sabes exactamente cuánto ganarás.</div>
<div class="highlight-box">
<h3>📊 Tasas típicas de productos cooperativos (2026)</h3>
<ul>
<li>💚 Cuenta de ahorros ordinaria: 4.5% - 6% EA</li>
<li>🔵 CDT 90 días: 7.5% - 9% EA</li>
<li>🟡 CDT 180 días: 8.5% - 10.5% EA</li>
<li>🟠 CDT 360 días: 9.5% - 12% EA</li>
</ul>
<p style="font-size:11px;color:var(--txt3);margin-top:8px;">*Tasas referenciales. Consulta las tasas vigentes con tu cooperativa.</p>
</div>
<p>Una estrategia popular es la <strong>"escalera de CDT"</strong>: distribuir el capital en CDT con vencimientos escalonados (a 3, 6, 9 y 12 meses), lo que proporciona liquidez periódica manteniendo buenas tasas.</p>
<div class="callout"><strong>💡 Ventaja cooperativa:</strong> Los CDT cooperativos suelen ofrecer tasas 1-2 puntos porcentuales superiores a los de la banca comercial, manteniendo el mismo nivel de seguridad (Fogacoop).</div>`
            }
          ],
          quiz: [
            { q: '¿En qué se diferencia un CDT de una cuenta de ahorros?', opts: ['El CDT tiene plazo fijo y tasa garantizada desde el inicio', 'El CDT no tiene tasa de interés', 'La cuenta de ahorros tiene mayor rentabilidad', 'El CDT no está protegido por Fogacoop'], answer: 0 },
            { q: '¿Qué es la "escalera de CDT"?', opts: ['CDT con vencimientos escalonados para liquidez periódica', 'Un CDT que crece automáticamente', 'Un crédito vinculado a CDT', 'Un seguro de inversión'], answer: 0 },
            { q: '¿Qué tipo de renta ofrece un CDT?', opts: ['Renta fija', 'Renta variable', 'Renta mixta', 'Sin renta'], answer: 0 }
          ]
        }
      ]
    },
    {
      id: 'c6', emoji: '👑',
      title: 'Liderazgo Cooperativo',
      description: 'Desarrolla las competencias para liderar equipos y participar en la gobernanza democrática de la cooperativa.',
      category: 'Liderazgo', level: 'avanzado', duration: 90, totalXP: 750, certificate: true,
      modules: [
        {
          id: 'c6-m1', title: 'Fundamentos del Liderazgo Cooperativo',
          lessons: [
            {
              id: 'c6-m1-l1', title: 'Liderazgo democrático en cooperativas', duration: 20, xp: 150,
              content: `<p class="lead">El liderazgo en una cooperativa es fundamentalmente diferente al de una empresa tradicional: aquí se lidera sin jerarquía autoritaria, con legitimidad democrática.</p>
<div class="key-concept"><strong>Liderazgo cooperativo:</strong> La capacidad de influir positivamente en la comunidad cooperativa para alcanzar objetivos colectivos, respetando siempre los valores y principios cooperativos y la voluntad democrática de los socios.</div>
<h3>Características del líder cooperativo</h3>
<ul>
<li>🎙️ <strong>Comunicación:</strong> Transparente, bidireccional y accesible para todos los socios</li>
<li>🤝 <strong>Consenso:</strong> Busca acuerdos antes que imposiciones</li>
<li>📚 <strong>Conocimiento:</strong> Domina los principios cooperativos y la normativa</li>
<li>🌱 <strong>Desarrollo:</strong> Promueve el crecimiento de otros líderes</li>
<li>⚖️ <strong>Imparcialidad:</strong> Toma decisiones sin favoritismos</li>
<li>🔭 <strong>Visión:</strong> Equilibra las necesidades actuales con el futuro de la cooperativa</li>
</ul>
<p>A diferencia de las empresas privadas, el líder cooperativo es <strong>elegido por los socios</strong> y debe rendirles cuentas periódicamente. Su autoridad viene del mandato democrático, no de la propiedad del capital.</p>
<div class="callout"><strong>💡 Reflexión:</strong> ¿Eres un líder que informa o uno que consulta? Los mejores líderes cooperativos hacen ambas cosas, pero priorizan la consulta porque saben que la inteligencia colectiva supera a la individual.</div>`
            },
            {
              id: 'c6-m1-l2', title: 'Toma de decisiones colectiva', duration: 18, xp: 130,
              content: `<p class="lead">La toma de decisiones en una cooperativa sigue procesos democráticos formales. Conocerlos te permite participar efectivamente y liderar con legitimidad.</p>
<div class="key-concept"><strong>Estructura de gobierno cooperativo:</strong> Asamblea General (máximo órgano) → Junta Directiva (dirección estratégica) → Comité de Control Social (vigilancia) → Gerencia (ejecución).</div>
<h3>La Asamblea General</h3>
<p>Es la máxima autoridad de la cooperativa. Sus decisiones obligan a todos los socios, incluso a quienes votaron en contra. Entre sus funciones:</p>
<ul>
<li>📊 Aprobar estados financieros y distribución de excedentes</li>
<li>🗳️ Elegir representantes a la Junta Directiva</li>
<li>📝 Reformar los estatutos</li>
<li>💰 Fijar las cuotas de administración</li>
</ul>
<h3>Métodos de decisión colectiva</h3>
<ul>
<li><strong>Consenso:</strong> Ideal para decisiones importantes. Requiere más tiempo pero genera mayor compromiso.</li>
<li><strong>Mayoría simple:</strong> Más de la mitad. Para decisiones rutinarias.</li>
<li><strong>Mayoría calificada:</strong> 2/3 o más. Para decisiones trascendentales.</li>
</ul>
<div class="callout"><strong>💡 Clave:</strong> Participar en la Asamblea General no es un derecho opcional — es una responsabilidad. Tu voz y tu voto dan forma al futuro de la cooperativa. La democracia se ejerce o se pierde.</div>`
            }
          ],
          quiz: [
            { q: '¿De dónde proviene la autoridad del líder en una cooperativa?', opts: ['Del mandato democrático de los socios', 'De su capital invertido', 'Del gobierno nacional', 'De la gerencia'], answer: 0 },
            { q: '¿Cuál es el máximo órgano de gobierno de una cooperativa?', opts: ['Asamblea General', 'Junta Directiva', 'Comité de Control', 'Gerencia'], answer: 0 },
            { q: '¿Qué tipo de decisión requiere una mayoría calificada (2/3)?', opts: ['Decisiones trascendentales o reformas estatutarias', 'Decisiones rutinarias', 'Elección de comités', 'Aprobación de informes'], answer: 0 }
          ]
        }
      ]
    }
  ]

  function getCourse(id: string) {
    return courses.find(c => c.id === id)
  }

  function getCourseProgress(courseId: string, completedLessons: string[]) {
    const course = getCourse(courseId)
    if (!course) return 0
    const total = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
    const done = course.modules.reduce((sum, m) =>
      sum + m.lessons.filter(l => completedLessons.includes(l.id)).length, 0)
    return total > 0 ? Math.round((done / total) * 100) : 0
  }

  return { courses, getCourse, getCourseProgress }
})
