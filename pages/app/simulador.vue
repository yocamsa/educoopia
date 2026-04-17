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
                  <span class="pb-icon">{{ p.icon }}</span>
                  <span class="pb-name">{{ p.name }}</span>
                  <span class="pb-rate" :style="{ color: p.color }">{{ p.rate }}% EA</span>
                </div>
                <div class="pb-desc">{{ p.desc }}</div>
              </button>
            </div>
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
              <!-- Grid lines -->
              <line v-for="i in 4" :key="i"
                :x1="chartPad" :y1="chartH - chartPad - (i/4)*(chartH-2*chartPad)"
                :x2="chartW - 10" :y2="chartH - chartPad - (i/4)*(chartH-2*chartPad)"
                stroke="rgba(255,255,255,.05)" stroke-width="1"/>

              <!-- Area fill -->
              <path :d="areaPath" fill="url(#chartGrad)" opacity=".6"/>
              <!-- Line -->
              <path :d="linePath" fill="none" :stroke="currentProduct.color" stroke-width="2.5" stroke-linecap="round"/>
              <!-- Investment line (dashed) -->
              <path :d="investLinePath" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1.5" stroke-dasharray="4,4"/>

              <!-- Dots -->
              <circle v-for="(pt, i) in chartPoints" :key="i"
                :cx="pt.x" :cy="pt.y" r="4"
                :fill="currentProduct.color" stroke="var(--s1)" stroke-width="2"/>

              <!-- Labels -->
              <text v-for="(pt, i) in chartPoints" :key="`l${i}`"
                :x="pt.x" :y="chartH - 6" text-anchor="middle"
                fill="rgba(255,255,255,.3)" font-size="9">
                Año {{ i + 1 }}
              </text>

              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" :stop-color="currentProduct.color" stop-opacity=".3"/>
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
            💡 <strong>Tip:</strong> Los aportes mensuales adicionales aceleran significativamente el crecimiento gracias al interés compuesto.
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

const products = [
  { id: 'ahorro', name: 'Cuenta de Ahorros', rate: 5.5, icon: '🐷', color: '#38BDF8', desc: 'Liquidez inmediata, bajo riesgo' },
  { id: 'cdt90', name: 'CDT 90 días', rate: 8.0, icon: '📄', color: '#39FF8A', desc: 'Corto plazo, renovación trimestral' },
  { id: 'cdt180', name: 'CDT 180 días', rate: 9.5, icon: '📋', color: '#F5C018', desc: 'Semestral, buena rentabilidad' },
  { id: 'cdt360', name: 'CDT 360 días', rate: 11.2, icon: '💎', color: '#FF6058', desc: 'Mayor rentabilidad, largo plazo' },
]

const currentProduct = computed(() => products.find(p => p.id === selectedProduct.value)!)

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
const chartH = 200
const chartPad = 30

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
</script>

<style scoped>
.sim-page { max-width: 1100px; }
.sim-layout { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: start; }

.ctrl-group { margin-bottom: 22px; }
.ctrl-group:last-child { margin-bottom: 0; }
.amount-display { font-family: var(--fd); font-size: 26px; font-weight: 800; color: var(--grn); margin-bottom: 8px; }
.range { width: 100%; margin-bottom: 4px; }
.range-sky::-webkit-slider-thumb { background: var(--sky); box-shadow: 0 0 8px rgba(56,189,248,.4); }
.range-gld::-webkit-slider-thumb { background: var(--gld); box-shadow: 0 0 8px rgba(245,192,24,.4); }
.range-labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--txt3); font-weight: 600; }

.product-list { display: flex; flex-direction: column; gap: 8px; }
.product-btn {
  background: var(--s2); border: 1px solid var(--brd); border-radius: 11px;
  padding: 11px 14px; text-align: left; cursor: pointer; transition: all .18s;
}
.product-btn:hover { border-color: var(--brd2); }
.product-btn.active { border-color: var(--brd2); background: var(--s3); }
.pb-top { display: flex; align-items: center; gap: 8px; margin-bottom: 3px; }
.pb-icon { font-size: 16px; }
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
.data-table .last-row td { background: rgba(57,255,138,.05); color: var(--txt); }

.tip-box {
  background: rgba(245,192,24,.07); border: 1px solid rgba(245,192,24,.2);
  border-radius: 10px; padding: 12px 14px; font-size: 13px; color: var(--txt2);
}
.tip-box strong { color: var(--gld); }

@media(max-width:900px) { .sim-layout { grid-template-columns: 1fr; } }
</style>
