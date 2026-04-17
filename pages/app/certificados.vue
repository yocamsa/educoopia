<template>
  <div class="certs-page">

    <!-- Empty state -->
    <div v-if="user.certificates.length === 0" class="empty-state">
      <div class="es-icon">🎓</div>
      <h2>Aún no tienes certificados</h2>
      <p>Completa un curso para obtener tu primer certificado digital verificable.</p>
      <NuxtLink to="/app/cursos" class="btn btn-p" style="margin-top:16px">Explorar cursos →</NuxtLink>
    </div>

    <div v-else>
      <!-- Header with count -->
      <div class="certs-header rev" :class="{ on: mounted }">
        <div>
          <div class="lbl" style="margin-bottom:8px">Mis certificaciones</div>
          <h2 class="ch-title">{{ user.certificates.length }} certificado{{ user.certificates.length > 1 ? 's' : '' }} obtenido{{ user.certificates.length > 1 ? 's' : '' }}</h2>
        </div>
        <div class="ch-stat">
          <div class="chs-n">{{ totalHours }}</div>
          <div class="chs-l">horas de formación</div>
        </div>
      </div>

      <!-- Certs grid -->
      <div class="certs-grid">
        <div v-for="(cert, i) in user.certificates" :key="cert.id"
          class="cert-preview-card rev" :class="{ on: mounted }"
          :style="{ transitionDelay: (0.1 + i * 0.08) + 's' }">

          <div class="cpc-badge">✅ Verificado</div>
          <div class="cpc-emoji">🏆</div>
          <div class="cpc-title">{{ cert.courseTitle }}</div>
          <div class="cpc-inst">{{ cert.institution }}</div>
          <div class="cpc-meta">
            <span>📅 {{ formatDate(cert.issuedAt) }}</span>
            <span>⏱ {{ cert.hours }}h</span>
          </div>
          <div class="cpc-id">ID: {{ cert.certId }}</div>
          <button class="btn btn-p btn-sm" style="width:100%;margin-top:12px" @click="viewCert(cert)">
            Ver certificado →
          </button>
        </div>
      </div>
    </div>

    <!-- Certificate Modal -->
    <Teleport to="body">
      <div v-if="activeCert" class="modal-overlay" @click.self="activeCert = null">
        <div class="modal-wrap">
          <div class="modal-actions no-print">
            <button class="btn btn-p btn-sm" @click="printCert">🖨️ Descargar / Imprimir</button>
            <button class="btn btn-o btn-sm" @click="activeCert = null">Cerrar ×</button>
          </div>

          <!-- The actual certificate -->
          <div class="certificate print-cert" id="cert-print">
            <div class="cert-corner tl"></div>
            <div class="cert-corner tr"></div>
            <div class="cert-corner bl"></div>
            <div class="cert-corner br"></div>

            <!-- Header -->
            <div class="cert-header">
              <div class="cert-logo-wrap">
                <div class="cert-logo-box">IA</div>
                <div>
                  <div class="cert-logo-name">IA-COOP</div>
                  <div class="cert-logo-sub">Plataforma de Educación Cooperativa</div>
                </div>
              </div>
              <div class="cert-seal">🏆</div>
            </div>

            <!-- Decorative line -->
            <div class="cert-deco-line"></div>

            <!-- Body -->
            <div class="cert-body">
              <div class="cert-sub-label">CERTIFICA QUE</div>
              <div class="cert-recipient">{{ user.profile.name }}</div>
              <div class="cert-recipient-id">CC {{ user.profile.cedula }} · {{ user.profile.city }}, Colombia</div>
            </div>

            <!-- Course block -->
            <div class="cert-course-block">
              <div class="ccb-label">HA COMPLETADO SATISFACTORIAMENTE EL PROGRAMA</div>
              <div class="ccb-title">{{ activeCert.courseTitle }}</div>
              <div class="ccb-hours">Programa de formación cooperativa · {{ activeCert.hours }} horas</div>
            </div>

            <!-- Institution -->
            <div class="cert-inst-block">
              <span style="font-size:22px">🏛️</span>
              <div>
                <div class="cib-name">{{ activeCert.institution }}</div>
                <div class="cib-sub">Institución educativa habilitadora · Registro SNIES</div>
              </div>
            </div>

            <!-- Footer -->
            <div class="cert-footer">
              <div class="cert-qr-wrap">
                <div class="cert-qr">
                  <svg viewBox="0 0 21 21" fill="none">
                    <rect width="9" height="9" fill="#050E08"/>
                    <rect x="1" y="1" width="7" height="7" fill="white"/>
                    <rect x="2" y="2" width="5" height="5" fill="#050E08"/>
                    <rect x="12" width="9" height="9" fill="#050E08"/>
                    <rect x="13" y="1" width="7" height="7" fill="white"/>
                    <rect x="14" y="2" width="5" height="5" fill="#050E08"/>
                    <rect y="12" width="9" height="9" fill="#050E08"/>
                    <rect x="1" y="13" width="7" height="7" fill="white"/>
                    <rect x="2" y="14" width="5" height="5" fill="#050E08"/>
                    <rect x="12" y="12" width="2" height="2" fill="#050E08"/>
                    <rect x="15" y="12" width="2" height="2" fill="#050E08"/>
                    <rect x="18" y="12" width="3" height="2" fill="#050E08"/>
                    <rect x="12" y="15" width="3" height="2" fill="#050E08"/>
                    <rect x="17" y="15" width="4" height="2" fill="#050E08"/>
                    <rect x="12" y="18" width="2" height="3" fill="#050E08"/>
                    <rect x="16" y="18" width="3" height="3" fill="#050E08"/>
                    <rect x="19" y="18" width="2" height="3" fill="#050E08"/>
                  </svg>
                </div>
                <div class="cert-qr-info">
                  <div>Verificar en:</div>
                  <div class="cert-qr-url">ia-coop.co/verificar</div>
                </div>
              </div>
              <div class="cert-date-wrap">
                <div class="cert-date-label">Expedido el</div>
                <div class="cert-date-val">{{ formatDateFull(activeCert.issuedAt) }}</div>
                <div class="cert-id">ID: {{ activeCert.certId }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
definePageMeta({ layout: 'app' })

const user = useUserStore()
const mounted = ref(false)
const activeCert = ref<typeof user.certificates[0] | null>(null)

const totalHours = computed(() => user.certificates.reduce((s, c) => s + c.hours, 0))

function viewCert(cert: typeof user.certificates[0]) { activeCert.value = cert }

function printCert() {
  window.print()
}

function formatDate(d: Date | string) {
  const date = new Date(d)
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}
function formatDateFull(d: Date | string) {
  const date = new Date(d)
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(() => { mounted.value = true })
</script>

<style scoped>
.certs-page { max-width: 1100px; }

.empty-state { text-align: center; padding: 80px 20px; }
.es-icon { font-size: 64px; margin-bottom: 16px; }
.empty-state h2 { font-size: 22px; margin-bottom: 8px; }
.empty-state p { font-size: 14px; color: var(--txt2); }

.certs-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.ch-title { font-size: 24px; font-weight: 800; }
.ch-stat { text-align: center; }
.chs-n { font-family: var(--fd); font-size: 32px; font-weight: 800; color: var(--grn); }
.chs-l { font-size: 12px; color: var(--txt3); font-weight: 600; }

.certs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.cert-preview-card {
  background: var(--s1); border: 1px solid var(--brd2); border-radius: 18px;
  padding: 22px; text-align: center; transition: transform .2s, box-shadow .2s;
  position: relative; overflow: hidden;
}
.cert-preview-card::before {
  content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 60%; height: 3px; background: linear-gradient(90deg, var(--grn), var(--gld));
  border-radius: 0 0 3px 3px;
}
.cert-preview-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(57,255,138,.1); }
.cpc-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: var(--grn-b); border: 1px solid var(--brd2); border-radius: 100px;
  padding: 3px 10px; font-size: 11px; font-weight: 700; color: var(--grn); margin-bottom: 14px;
}
.cpc-emoji { font-size: 36px; margin-bottom: 10px; }
.cpc-title { font-family: var(--fd); font-size: 15px; font-weight: 700; margin-bottom: 6px; line-height: 1.3; }
.cpc-inst { font-size: 12px; color: var(--txt3); margin-bottom: 10px; }
.cpc-meta { display: flex; gap: 12px; justify-content: center; font-size: 12px; color: var(--txt2); font-weight: 600; margin-bottom: 6px; }
.cpc-id { font-size: 10px; color: var(--txt3); font-family: monospace; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.8);
  backdrop-filter: blur(8px); z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 24px;
  overflow-y: auto;
}
.modal-wrap { width: 100%; max-width: 740px; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-bottom: 14px; }

/* Certificate */
.certificate {
  background: linear-gradient(135deg, #0A1A0F, #0F2518);
  border: 2px solid rgba(57,255,138,.3); border-radius: 20px;
  padding: 36px; position: relative; overflow: hidden;
  box-shadow: 0 0 60px rgba(57,255,138,.12);
}
.cert-corner { position: absolute; width: 50px; height: 50px; opacity: .18; }
.cert-corner.tl { top:10px;left:10px;border-top:2px solid #39FF8A;border-left:2px solid #39FF8A;border-radius:4px 0 0 0 }
.cert-corner.tr { top:10px;right:10px;border-top:2px solid #39FF8A;border-right:2px solid #39FF8A;border-radius:0 4px 0 0 }
.cert-corner.bl { bottom:10px;left:10px;border-bottom:2px solid #39FF8A;border-left:2px solid #39FF8A;border-radius:0 0 0 4px }
.cert-corner.br { bottom:10px;right:10px;border-bottom:2px solid #39FF8A;border-right:2px solid #39FF8A;border-radius:0 0 4px 0 }

.cert-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.cert-logo-wrap { display: flex; align-items: center; gap: 10px; }
.cert-logo-box { width: 36px;height: 36px;background: var(--grn);border-radius: 9px;display: flex;align-items: center;justify-content: center;color: var(--bg);font-size: 14px;font-weight: 900; }
.cert-logo-name { font-family: var(--fd); font-size: 16px; font-weight: 800; color: var(--grn); }
.cert-logo-sub { font-size: 10px; color: var(--txt3); }
.cert-seal { width: 52px;height: 52px;border-radius: 50%;background: linear-gradient(135deg, var(--gld), var(--crl));display: flex;align-items: center;justify-content: center;font-size: 22px; }

.cert-deco-line { height: 2px; background: linear-gradient(90deg, transparent, var(--grn), var(--gld), transparent); margin: 16px 0; }

.cert-body { text-align: center; margin-bottom: 20px; }
.cert-sub-label { font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: var(--txt3); margin-bottom: 8px; }
.cert-recipient { font-family: var(--fd); font-size: 30px; font-weight: 800; color: var(--txt); margin-bottom: 4px; }
.cert-recipient-id { font-size: 13px; color: var(--txt2); }

.cert-course-block { background: rgba(57,255,138,.04); border: 1px solid var(--brd); border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 16px; }
.ccb-label { font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--txt3); margin-bottom: 8px; }
.ccb-title { font-family: var(--fd); font-size: 20px; font-weight: 800; color: var(--txt); margin-bottom: 4px; }
.ccb-hours { font-size: 13px; color: var(--txt2); }

.cert-inst-block { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(57,255,138,.03); border: 1px solid var(--brd); border-radius: 10px; margin-bottom: 18px; }
.cib-name { font-size: 13px; font-weight: 700; color: var(--txt); }
.cib-sub { font-size: 11px; color: var(--txt3); }

.cert-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 16px; border-top: 1px solid var(--brd); }
.cert-qr-wrap { display: flex; align-items: center; gap: 10px; }
.cert-qr { width: 52px; height: 52px; background: white; border-radius: 6px; padding: 4px; }
.cert-qr svg { width: 100%; height: 100%; }
.cert-qr-info { font-size: 11px; color: var(--txt3); }
.cert-qr-url { font-weight: 700; color: var(--grn); font-size: 12px; }
.cert-date-wrap { text-align: right; }
.cert-date-label { font-size: 10px; color: var(--txt3); font-weight: 600; }
.cert-date-val { font-size: 13px; font-weight: 700; color: var(--txt); }
.cert-id { font-size: 10px; color: var(--grn); font-family: monospace; margin-top: 2px; }

@media(max-width:900px) { .certs-grid { grid-template-columns: 1fr; } }
@media(max-width:600px) { .certs-grid { grid-template-columns: 1fr; } }

@media print {
  .no-print, .modal-actions, .certs-page { display: none !important; }
  .modal-overlay { position: static !important; background: none !important; backdrop-filter: none !important; padding: 0 !important; }
  .modal-wrap { max-width: 100%; }
  .certificate { background: white !important; border-color: #ccc !important; box-shadow: none !important; }
  .certificate * { color: black !important; }
  .cert-deco-line { background: #ccc !important; }
}
</style>
