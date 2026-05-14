<template>
  <div class="sim-page">
    <div class="sim-layout">

      <!-- Left: Controls -->
      <div class="sim-controls">
        <div class="card" style="margin-bottom:16px">
          <div class="lbl" style="margin-bottom:16px">Parámetros de inversión</div>

          <!-- Capital inicial -->
          <div class="ctrl-group">
            <label class="input-label">Capital inicial</label>
            <div class="amount-display">{{ formatCOP(capital) }}</div>
            <input type="range" v-model.number="capital" :min="500000" :max="50000000" :step="500000" class="range">
            <div class="range-labels"><span>$500K</span><span>$50M</span></div>
          </div>

          <!-- Plazo -->
          <div class="ctrl-group">
            <label class="input-label">Plazo de inversión</label>
            <div class="amount-display" style="color:var(--sky)">{{ plazo }} {{ plazo === 1 ? 'año' : 'años' }}</div>
            <input type="range" v-model.number="plazo" :min="1" :max="10" :step="1" class="range range-sky">
            <div class="range-labels"><span>1 año</span><span>10 años</span></div>
          </div>

          <!-- Ahorro mensual adicional -->
          <div class="ctrl-group">
            <label class="input-label">Aporte mensual adicional <span style="font-size:10px;color:var(--txt3)">(opcional)</span></label>
            <div class="amount-display" style="color:var(--gld)">{{ formatCOP(aporteMensual) }}</div>
            <input type="range" v-model.number="aporteMensual" :min="0" :max="2000000" :step="50000" class="range range-gld">
            <div class="range-labels"><span>$0</span><span>$2M/mes</span></div>
          </div>

          <!-- Producto -->
          <div class="ctrl-group">
            <label class="input-label">Producto de inversión cooperativo</label>
            <div class="product-list">
              <button v-for="p in products" :key="p.id"
                class="product-btn" :class="{ active: selectedProduct === p.id }"
                @click="selectedProduct = p.id">
                <div class="pb-top">
                  <span class="pb-icon" v-html="p.icon"></span>
                  <span class="pb-name">{{ p.name }}</span>
                  <span class="pb-rate" :style="{ color: p.color }">{{ p.rate }}% EA</span>
                </div>
                <div class="pb-desc">{{ p.desc }}</div>
              </button>
            </div>
          </div>

          <!-- Tasa efectiva anual personalizada -->
          <div class="ctrl-group">
            <label class="input-label">
              Tasa efectiva anual
              <span style="font-size:10px;color:var(--txt3);font-weight:400"> · personalizada</span>
            </label>
            <div class="amount-display" style="color:var(--crl)">{{ customRate.toFixed(1) }}% EA</div>
            <input type="range" v-model.number="customRate" :min="0.5" :max="30" :step="0.1" class="range range-crl">
            <div class="range-labels"><span>0.5%</span><span>30%</span></div>
          </div>
        </div>
      </div>

      <!-- Right: Results -->
      <div class="sim-results">

        <!-- Result header -->
        <div class="result-hero card" style="margin-bottom:16px">
          <div class="rh-top">
            <div>
              <div class="rh-label">Valor final proyectado</div>
              <div class="rh-amount">{{ formatCOP(finalValue) }}</div>
            </div>
            <div class="rh-badge" :style="{ background: currentProduct.color + '22', border: `1px solid ${currentProduct.color}44`, color: currentProduct.color }">
              +{{ returnPct }}% rentabilidad
            </div>
          </div>
          <div class="rh-grid">
            <div class="rh-stat">
              <div class="rh-stat-n">{{ formatCOP(totalInvested) }}</div>
              <div class="rh-stat-l">Total invertido</div>
            </div>
            <div class="rh-stat">
              <div class="rh-stat-n" style="color:var(--grn)">{{ formatCOP(totalGain) }}</div>
              <div class="rh-stat-l">Ganancia neta</div>
            </div>
            <div class="rh-stat">
              <div class="rh-stat-n" style="color:var(--sky)">{{ currentProduct.rate }}% EA</div>
              <div class="rh-stat-l">Tasa efectiva anual</div>
            </div>
          </div>
        </div>

        <!-- Chart -->
          <div class="card" style="margin-bottom:16px">
          <div class="lbl" style="margin-bottom:16px">Proyección año a año</div>
          <div class="chart-wrap">
            <svg :viewBox="`0 0 ${chartW} ${chartH}`" class="chart-svg">
              <!-- Vertical grid lines -->
              <line v-for="(pt, i) in chartPoints" :key="'vg'+i"
                :x1="pt.x" :y1="chartPad - 10" :x2="pt.x" :y2="chartH - chartPad"
                stroke="var(--txt3)" stroke-width="1" opacity=".12"/>

              <!-- Horizontal grid lines -->
              <line v-for="(t, i) in yTicks" :key="'hg'+i"
                :x1="chartPad" :y1="t.y" :x2="chartW - 10" :y2="t.y"
                stroke="var(--txt3)" stroke-width="1" opacity=".12"/>

              <!-- Y-axis labels -->
              <text v-for="(t, i) in yTicks" :key="'yl'+i"
                :x="chartPad - 8" :y="t.y + 3" text-anchor="end"
                fill="var(--txt3)" font-size="8" font-family="var(--fd)">
                {{ formatShort(t.value) }}
              </text>

              <!-- Area fill -->
              <path :d="areaPath" fill="url(#chartGrad)" opacity=".55"/>

              <!-- Investment line (dashed) -->
              <path :d="investLinePath" fill="none" stroke="var(--txt3)" stroke-width="1.5" stroke-dasharray="4,4" opacity=".35"/>

              <!-- Main line -->
              <path :d="linePath" fill="none" :stroke="currentProduct.color" stroke-width="2.5" stroke-linecap="round"/>

              <!-- Dots -->
              <circle v-for="(pt, i) in chartPoints" :key="'dt'+i"
                :cx="pt.x" :cy="pt.y" r="4.5"
                :fill="currentProduct.color" stroke="var(--s1)" stroke-width="2"/>

              <!-- Value labels on dots -->
              <text v-for="(pt, i) in chartPoints" :key="'vl'+i"
                :x="pt.x" :y="pt.y - 10" text-anchor="middle"
                fill="var(--txt2)" font-size="8" font-family="var(--fd)" font-weight="700">
                {{ formatShort(pt.val) }}
              </text>

              <!-- X-axis labels -->
              <text v-for="(pt, i) in chartPoints" :key="'xl'+i"
                :x="pt.x" :y="chartH - 6" text-anchor="middle"
                fill="var(--txt3)" font-size="9">
                Año {{ i + 1 }}
              </text>

              <!-- Legend -->
              <g :transform="`translate(${chartW - 118}, 12)`">
                <rect x="0" y="0" width="110" height="38" rx="6" fill="var(--s1)" stroke="var(--brd)"/>
                <line x1="10" y1="13" x2="24" y2="13" :stroke="currentProduct.color" stroke-width="2.5" stroke-linecap="round"/>
                <text x="28" y="16" fill="var(--txt2)" font-size="8" font-family="var(--fd)">Proyección</text>
                <line x1="10" y1="29" x2="24" y2="29" stroke="var(--txt3)" stroke-width="1.5" stroke-dasharray="3,3" opacity=".5"/>
                <text x="28" y="32" fill="var(--txt3)" font-size="8" font-family="var(--fd)">Invertido</text>
              </g>

              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" :stop-color="currentProduct.color" stop-opacity=".25"/>
                  <stop offset="100%" :stop-color="currentProduct.color" stop-opacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <!-- Year by year table -->
        <div class="card">
          <div class="lbl" style="margin-bottom:14px">Tabla detallada</div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Capital inicial</th>
                  <th>Aportes</th>
                  <th>Intereses</th>
                  <th>Total acumulado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in yearlyData" :key="row.year" :class="{ 'last-row': row.year === plazo }">
                  <td>{{ row.year }}</td>
                  <td>{{ formatCOP(capital) }}</td>
                  <td>{{ formatCOP(row.aportes) }}</td>
                  <td style="color:var(--grn)">{{ formatCOP(row.intereses) }}</td>
                  <td style="font-weight:700;color:var(--txt)">{{ formatCOP(row.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="tip-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="flex-shrink:0;color:var(--gld)"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
            <strong>Tip:</strong> Los aportes mensuales adicionales aceleran significativamente el crecimiento gracias al interés compuesto.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })

const capital = ref(5000000)
const plazo = ref(3)
const aporteMensual = ref(0)
const selectedProduct = ref('cdt180')
const customRate = ref(9.5) // se sincroniza con el producto al iniciar

const productIcons: Record<string, string> = {
  ahorro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>',
  cdt90: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  cdt180: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  cdt360: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
}
const products = [
  { id: 'ahorro', name: 'Cuenta de Ahorros', rate: 5.5, icon: productIcons.ahorro, color: '#38BDF8', desc: 'Liquidez inmediata, bajo riesgo' },
  { id: 'cdt90', name: 'CDT 90 días', rate: 8.0, icon: productIcons.cdt90, color: '#2A7B6B', desc: 'Corto plazo, renovación trimestral' },
  { id: 'cdt180', name: 'CDT 180 días', rate: 9.5, icon: productIcons.cdt180, color: '#F5C018', desc: 'Semestral, buena rentabilidad' },
  { id: 'cdt360', name: 'CDT 360 días', rate: 11.2, icon: productIcons.cdt360, color: '#FF6058', desc: 'Mayor rentabilidad, largo plazo' },
]

const currentProduct = computed(() => {
  const p = products.find(p => p.id === selectedProduct.value)!
  return { ...p, rate: customRate.value }
})

watch(selectedProduct, (id) => {
  const p = products.find(p => p.id === id)
  if (p) customRate.value = p.rate
})

function calcFV(pv: number, r: number, n: number, pmt: number) {
  const ra = Math.pow(1 + r, n)
  return pv * ra + pmt * 12 * (ra - 1) / r
}

const yearlyData = computed(() => {
  const r = currentProduct.value.rate / 100
  return Array.from({ length: plazo.value }, (_, i) => {
    const y = i + 1
    const total = calcFV(capital.value, r, y, aporteMensual.value)
    const aportes = aporteMensual.value * 12 * y
    const intereses = total - capital.value - aportes
    return { year: y, total: Math.round(total), aportes: Math.round(aportes), intereses: Math.round(intereses) }
  })
})

const finalValue = computed(() => yearlyData.value[yearlyData.value.length - 1]?.total ?? capital.value)
const totalInvested = computed(() => capital.value + aporteMensual.value * 12 * plazo.value)
const totalGain = computed(() => finalValue.value - totalInvested.value)
const returnPct = computed(() => Math.round((totalGain.value / totalInvested.value) * 100))

// ── Chart ─────────────────────────────────
const chartW = 500
const chartH = 220
const chartPad = 38

const yTicks = computed(() => {
  const maxVal = Math.max(...yearlyData.value.map(r => r.total))
  const minVal = capital.value * 0.8
  const range = maxVal - minVal
  if (range <= 0) return []
  const rawStep = range / 4
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)))
  const niceStep = Math.ceil(rawStep / mag) * mag
  const ticks = []
  for (let v = Math.floor(minVal / niceStep) * niceStep; v <= maxVal + niceStep * 0.5; v += niceStep) {
    const y = chartH - chartPad - ((v - minVal) / (range + 1)) * (chartH - 2 * chartPad)
    ticks.push({ value: Math.round(v), y })
  }
  return ticks
})

const chartPoints = computed(() => {
  const maxVal = Math.max(...yearlyData.value.map(r => r.total))
  return yearlyData.value.map((row, i) => {
    const x = chartPad + (i / (plazo.value - 1 || 1)) * (chartW - chartPad - 10)
    const y = chartH - chartPad - ((row.total - capital.value * 0.8) / (maxVal - capital.value * 0.8 + 1)) * (chartH - 2 * chartPad)
    return { x, y, val: row.total }
  })
})

const linePath = computed(() => {
  if (!chartPoints.value.length) return ''
  return chartPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
})
const areaPath = computed(() => {
  if (!chartPoints.value.length) return ''
  const line = chartPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const last = chartPoints.value[chartPoints.value.length - 1]
  const first = chartPoints.value[0]
  return `${line} L${last.x},${chartH - chartPad} L${first.x},${chartH - chartPad} Z`
})

const investLinePath = computed(() => {
  if (!chartPoints.value.length) return ''
  const maxVal = Math.max(...yearlyData.value.map(r => r.total))
  const investedData = yearlyData.value.map((row, i) => {
    const inv = capital.value + aporteMensual.value * 12 * row.year
    const x = chartPad + (i / (plazo.value - 1 || 1)) * (chartW - chartPad - 10)
    const y = chartH - chartPad - ((inv - capital.value * 0.8) / (maxVal - capital.value * 0.8 + 1)) * (chartH - 2 * chartPad)
    return { x, y }
  })
  return investedData.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
})

function formatCOP(n: number) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'K'
  return '$' + n.toLocaleString('es-CO')
}
function formatShort(n: number) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + 'M'
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'K'
  return '$' + n
}
</script>

<style scoped>
.sim-page { width: 100%; }
.sim-layout { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: start; }
.sim-controls { }

.ctrl-group { margin-bottom: 22px; }
.ctrl-group:last-child { margin-bottom: 0; }
.amount-display { font-family: var(--fd); font-size: 26px; font-weight: 800; color: var(--grn); margin-bottom: 8px; }
.range { width: 100%; margin: 6px 0 4px; display: block; }
.range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--grn); cursor: pointer; box-shadow: 0 0 8px rgba(42,123,107,.35); border: none; }
.range::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: var(--grn); cursor: pointer; border: none; }
.range-sky::-webkit-slider-thumb { background: var(--sky); box-shadow: 0 0 8px rgba(56,189,248,.4); }
.range-gld::-webkit-slider-thumb { background: var(--gld); box-shadow: 0 0 8px rgba(245,192,24,.4); }
.range-crl::-webkit-slider-thumb { background: var(--crl); box-shadow: 0 0 8px rgba(199,96,87,.4); }
.range-crl::-moz-range-thumb { background: var(--crl); border: none; }
.range-labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--txt3); font-weight: 600; }

.product-list { display: flex; flex-direction: column; gap: 8px; }
.product-btn {
  background: var(--s2); border: 1px solid var(--brd); border-radius: 11px;
  padding: 11px 14px; text-align: left; cursor: pointer; transition: all .18s;
}
.product-btn:hover { border-color: var(--brd2); }
.product-btn.active { border-color: var(--brd2); background: var(--s3); }
.pb-top { display: flex; align-items: center; gap: 8px; margin-bottom: 3px; }
.pb-icon { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; flex-shrink: 0; }
.pb-icon svg { width: 18px; height: 18px; }
.pb-name { font-size: 13px; font-weight: 700; color: var(--txt); flex: 1; }
.pb-rate { font-size: 13px; font-weight: 800; font-family: var(--fd); }
.pb-desc { font-size: 11px; color: var(--txt3); }

.result-hero { }
.rh-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
.rh-label { font-size: 12px; color: var(--txt3); font-weight: 600; margin-bottom: 6px; }
.rh-amount { font-family: var(--fd); font-size: 34px; font-weight: 800; color: var(--txt); }
.rh-badge { padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 700; }
.rh-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.rh-stat-n { font-family: var(--fd); font-size: 18px; font-weight: 800; color: var(--txt); margin-bottom: 3px; }
.rh-stat-l { font-size: 11px; color: var(--txt3); font-weight: 600; }

.chart-wrap { background: var(--s2); border-radius: 12px; padding: 8px; }
.chart-svg { width: 100%; display: block; }

.table-wrap { overflow-x: auto; margin-bottom: 14px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th {
  text-align: left; padding: 8px 12px; font-size: 11px; font-weight: 700;
  letter-spacing: .08em; text-transform: uppercase; color: var(--txt3);
  border-bottom: 1px solid var(--brd); white-space: nowrap;
}
.data-table td { padding: 10px 12px; border-bottom: 1px solid var(--brd); color: var(--txt2); }
.data-table .last-row td { background: var(--grn-b); color: var(--txt); }

.tip-box {
  display: flex; align-items: center; gap: 8px;
  background: rgba(245,192,24,.07); border: 1px solid rgba(245,192,24,.2);
  border-radius: 10px; padding: 12px 14px; font-size: 13px; color: var(--txt2);
}
.tip-box strong { color: var(--gld); }

@media(max-width:900px) { .sim-layout { grid-template-columns: 1fr; } }
</style>
