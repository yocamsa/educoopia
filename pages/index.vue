<template>
  <div class="lp">
    <!-- Nav -->
    <nav :class="{ stuck: scrolled }">
      <div class="nav-i">
        <div class="logo"><div class="logo-b">IA</div><em>IA</em>-COOP</div>
        <div class="nav-r">
          <a href="#features" class="nav-a">Plataforma</a>
          <NuxtLink to="/login" class="btn btn-p btn-sm">Entrar a la plataforma →</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <canvas ref="cnv" class="hero-canvas"></canvas>
      <div class="wrap hero-g">
        <div class="hero-l">
          <div class="badge" style="animation:fadeUp .7s both">
            <span class="dot"></span> Plataforma IA de educación cooperativa
          </div>
          <h1 style="animation:fadeUp .7s .1s both">
            Aprende a tu<br>propio ritmo<br>con <span class="grd">IA-COOP</span>
          </h1>
          <p class="sub" style="animation:fadeUp .7s .2s both">
            La plataforma potenciada por IA que adapta los cursos cooperativos a tu perfil, nivel y objetivos. Personalizado, gamificado y certificado.
          </p>
          <div class="acts" style="animation:fadeUp .7s .3s both">
            <NuxtLink to="/login" class="btn btn-p">Comenzar mi aprendizaje →</NuxtLink>
            <a href="#features" class="btn btn-o">▶ Ver más</a>
          </div>
          <div class="stats" style="animation:fadeUp .7s .4s both">
            <div><div class="sn" ref="s1">12.400+</div><div class="sl">Asociados activos</div></div>
            <div><div class="sn" ref="s2">98%</div><div class="sl">Satisfacción</div></div>
            <div><div class="sn" ref="s3">340</div><div class="sl">Módulos disponibles</div></div>
          </div>
        </div>
        <div class="hero-r" style="animation:fadeUp .7s .2s both">
          <div class="fc fc1">
            <span style="font-size:17px">🎯</span>
            <div><div style="font-size:9px;color:var(--txt3);font-weight:700;letter-spacing:.08em">COMPATIBILIDAD</div><div style="color:var(--grn);font-family:var(--fd);font-size:20px;font-weight:800">94%</div></div>
          </div>
          <div class="fc fc2">
            <span>🔥</span>
            <div><div style="font-size:11px;color:var(--txt3)">Racha activa</div><div style="color:var(--crl);font-weight:700;font-size:13px">12 días</div></div>
          </div>
          <div class="pc">
            <div class="pc-top">
              <div class="av">MS</div>
              <div><div style="font-size:15px;font-weight:700">María Suárez</div><div style="font-size:11px;color:var(--txt3)">Asociada · 3 años · Salud</div></div>
              <div style="margin-left:auto;text-align:right"><div style="font-size:10px;color:var(--txt3)">Nivel</div><div style="font-family:var(--fd);font-weight:800;color:var(--gld);font-size:14px">⭐ Experto</div></div>
            </div>
            <div class="ai-tag"><span>🤖 IA analizando tu perfil...</span><div class="dots"><span></span><span></span><span></span></div></div>
            <div class="tags-w">
              <span class="tag tag-grn">Salud</span><span class="tag tag-grn">Finanzas</span>
              <span class="tag">35 años</span><span class="tag">Bogotá</span>
            </div>
            <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--txt3);margin-bottom:10px">Recomendado para ti</div>
            <div v-for="r in recs" :key="r.n" class="rec-item">
              <div class="rec-ic" :style="{ background: r.bg }">{{ r.icon }}</div>
              <div style="flex:1"><div style="font-size:13px;font-weight:600">{{ r.name }}</div><div style="font-size:11px;color:var(--txt3)">{{ r.meta }}</div></div>
              <div style="font-size:12px;font-weight:700;color:var(--grn)">{{ r.pct }}%</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="features">
      <div class="wrap">
        <div class="sec-hd">
          <div class="lbl">Plataforma inteligente</div>
          <h2>IA que aprende sobre ti<br>para enseñarte mejor</h2>
          <p>Algoritmos que analizan tu perfil y adaptan el contenido en tiempo real a tu nivel, edad y objetivos.</p>
        </div>
        <div class="feat-g">
          <div v-for="f in features" :key="f.title" class="feat-c card">
            <div class="feat-ic" :style="{ background: f.bg }">{{ f.icon }}</div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </div>
          <NuxtLink to="/login" class="feat-cta card">
            <div style="font-size:48px;margin-bottom:16px">🚀</div>
            <h3 style="font-size:22px;margin-bottom:12px">¿Listo para empezar?</h3>
            <p style="color:var(--txt2);margin-bottom:24px">Accede a todos los cursos, simuladores y certificaciones ahora mismo.</p>
            <span class="btn btn-p">Entrar a la plataforma →</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <div class="wrap ft-i">
        <div class="logo"><div class="logo-b">IA</div><em>IA</em>-COOP</div>
        <p style="font-size:12px;color:var(--txt3)">© 2026 IA-COOP · Todos los derechos reservados</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const cnv = ref<HTMLCanvasElement>()
const scrolled = ref(false)

const recs = [
  { icon: '💰', bg: 'var(--grn-a)', name: 'Crédito Responsable', meta: 'Módulo 4 · 25 min', pct: 97 },
  { icon: '📈', bg: 'var(--gld-a)', name: 'Simulador de Inversión', meta: 'Simulador · 40 min', pct: 91 },
  { icon: '🏥', bg: 'var(--crl-a)', name: 'Beneficios Sector Salud', meta: 'Módulo 2 · 15 min', pct: 88 },
]
const features = [
  { icon: '🧠', bg: 'var(--grn-a)', title: 'Motor de IA Personalizado', desc: 'Analiza más de 20 variables de tu perfil para recomendar el contenido exacto que necesitas.' },
  { icon: '🎮', bg: 'var(--crl-a)', title: 'Gamificación Completa', desc: 'XP, niveles, insignias, rachas y rankings cooperativos. Aprender nunca fue tan emocionante.' },
  { icon: '📊', bg: 'var(--sky-a)', title: 'Simuladores Financieros', desc: 'Practica inversión y crédito en entornos virtuales sin riesgo real, con datos del mercado cooperativo.' },
  { icon: '🏆', bg: 'var(--gld-a)', title: 'Certificaciones Digitales', desc: 'Certificados verificables con QR, avalados por instituciones educativas habilitadoras.' },
  { icon: '📱', bg: 'var(--grn-a)', title: '100% Digital', desc: 'Aprende desde cualquier dispositivo, en cualquier momento, a tu propio ritmo.' },
]

onMounted(() => {
  window.addEventListener('scroll', () => { scrolled.value = scrollY > 40 })

  const canvas = cnv.value!
  const ctx = canvas.getContext('2d')!
  let W = 0, H = 0
  const pts: any[] = []
  let mx: number|null = null, my: number|null = null

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight }
  resize()
  window.addEventListener('resize', resize)

  canvas.parentElement!.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top
  })
  canvas.parentElement!.addEventListener('mouseleave', () => { mx = null; my = null })

  for (let i = 0; i < 70; i++) pts.push({ x: Math.random()*1400, y: Math.random()*700, vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35, r: Math.random()*1.6+.4, o: Math.random()*.5+.15 })

  function draw() {
    ctx.clearRect(0, 0, W, H)
    for (let i = 0; i < pts.length; i++) {
      for (let j = i+1; j < pts.length; j++) {
        const dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y, d = Math.hypot(dx,dy)
        if (d < 110) { ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`rgba(57,255,138,${.13*(1-d/110)})`; ctx.lineWidth=.5; ctx.stroke() }
      }
      if (mx!==null) { const dx=pts[i].x-mx, dy=pts[i].y-my!, d=Math.hypot(dx,dy); if(d<130){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(mx,my!);ctx.strokeStyle=`rgba(57,255,138,${.25*(1-d/130)})`;ctx.lineWidth=1;ctx.stroke()} }
      const p = pts[i]; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(57,255,138,${p.o})`; ctx.fill()
      p.x+=p.vx; p.y+=p.vy
      if (mx!==null){const dx=p.x-mx,dy=p.y-my!,d=Math.hypot(dx,dy);if(d<65){p.x+=dx/d*1.3;p.y+=dy/d*1.3}}
      if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1
    }
    requestAnimationFrame(draw)
  }
  draw()
})
</script>

<style scoped>
.lp { overflow-x: hidden; }
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  padding: 14px 0; transition: all .3s; border-bottom: 1px solid transparent;
}
nav.stuck { background: rgba(5,14,8,.9); backdrop-filter: blur(20px); border-color: var(--brd); }
.nav-i { display:flex; align-items:center; justify-content:space-between; max-width:1180px; margin:0 auto; padding:0 24px; }
.logo { display:flex; align-items:center; gap:9px; font-family:var(--fd); font-weight:800; font-size:20px; color:var(--txt); }
.logo-b { width:32px;height:32px;background:var(--grn);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--bg);font-size:12px;font-weight:900; }
.logo em { color:var(--grn); font-style:normal; }
.nav-r { display:flex; align-items:center; gap:24px; }
.nav-a { color:var(--txt2); font-size:14px; font-weight:600; transition:color .2s; text-decoration:none; }
.nav-a:hover { color:var(--grn); }

.hero { min-height:100vh; display:flex; align-items:center; padding:120px 0 80px; overflow:hidden; position:relative; }
.hero-canvas { position:absolute; inset:0; pointer-events:none; width:100%; height:100%; }
.hero-g { position:relative; z-index:2; display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
.badge { display:inline-flex; align-items:center; gap:8px; background:rgba(57,255,138,.07); border:1px solid var(--brd2); border-radius:100px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--grn); margin-bottom:20px; }
.dot { width:6px;height:6px;background:var(--grn);border-radius:50%;animation:pulse 2s ease-in-out infinite; }
h1 { font-size:clamp(38px,4.5vw,62px); font-weight:800; margin-bottom:20px; }
.grd { background:linear-gradient(135deg,var(--grn) 0%,var(--gld) 55%,var(--grn) 100%); background-size:220% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shim 5s linear infinite; }
.sub { font-size:17px; color:var(--txt2); margin-bottom:32px; line-height:1.75; max-width:460px; }
.acts { display:flex; gap:12px; margin-bottom:44px; }
.stats { display:flex; gap:32px; }
.sn { font-family:var(--fd); font-size:26px; font-weight:800; color:var(--grn); }
.sl { font-size:11px; color:var(--txt3); font-weight:600; }

.pc { background:rgba(10,26,15,.88); border:1px solid var(--brd2); border-radius:20px; padding:20px; backdrop-filter:blur(18px); position:relative; overflow:hidden; }
.pc::before { content:''; position:absolute; top:0;left:0;right:0;height:2px; background:linear-gradient(90deg,transparent,var(--grn),var(--gld),transparent); animation:shim-ln 3s linear infinite; }
.pc-top { display:flex; align-items:center; gap:11px; margin-bottom:16px; }
.av { width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--grn),var(--gld));display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-size:17px;font-weight:800;color:var(--bg);flex-shrink:0; }
.ai-tag { background:rgba(57,255,138,.07);border:1px solid var(--brd);border-radius:9px;padding:9px 13px;margin-bottom:13px;display:flex;align-items:center;gap:9px;font-size:12px;color:var(--grn);font-weight:600; }
.dots { display:flex;gap:4px;margin-left:auto; }
.dots span { width:5px;height:5px;background:var(--grn);border-radius:50%;animation:bnc 1.4s ease-in-out infinite; }
.dots span:nth-child(2){animation-delay:.2s}.dots span:nth-child(3){animation-delay:.4s}
.tags-w { display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px; }
.rec-item { display:flex;align-items:center;gap:10px;padding:10px;background:var(--s2);border:1px solid var(--brd);border-radius:10px;margin-bottom:7px; }
.rec-item:last-child{margin-bottom:0}
.rec-ic { width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0; }
.fc { position:absolute;z-index:10;background:rgba(10,26,15,.92);border:1px solid var(--brd2);border-radius:13px;padding:10px 14px;backdrop-filter:blur(18px);font-size:12px;font-weight:600;color:var(--txt);display:flex;align-items:center;gap:8px; }
.fc1 { top:-16px;right:-16px;animation:flt 4s ease-in-out infinite; }
.fc2 { bottom:36px;left:-24px;animation:flt 4s ease-in-out infinite;animation-delay:2s; }

.features { background:var(--s1); padding:100px 0; }
.sec-hd { text-align:center; margin-bottom:56px; }
.sec-hd .lbl { justify-content:center; margin-bottom:12px; }
.sec-hd h2 { font-size:clamp(28px,3.5vw,48px); margin-bottom:14px; }
.sec-hd p { font-size:16px; color:var(--txt2); max-width:520px; margin:0 auto; line-height:1.7; }
.feat-g { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
.feat-c { cursor:default; }
.feat-ic { width:48px;height:48px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:21px;margin-bottom:16px; }
.feat-c h3 { font-size:17px;font-weight:700;margin-bottom:8px; }
.feat-c p { font-size:14px;color:var(--txt2);line-height:1.65; }
.feat-cta { grid-column:span 3; text-align:center; background:linear-gradient(135deg,rgba(57,255,138,.05),var(--s2)); cursor:pointer; padding:40px; }

footer { background:var(--s1); border-top:1px solid var(--brd); padding:32px 0; }
.ft-i { display:flex; align-items:center; justify-content:space-between; }

@keyframes shim-ln { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
@keyframes flt { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

@media(max-width:900px) {
  .hero-g { grid-template-columns:1fr; }
  .hero-r { display:none; }
  .feat-g { grid-template-columns:1fr; }
  .feat-cta { grid-column:1; }
}
</style>
