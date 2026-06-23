<script setup>
import { ref, onMounted, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useFavoritosStore } from '@/stores/useFavoritosStore'
import { useVotosStore } from '@/stores/useVotosStore'
import { useCatalogoStore } from '@/stores/useCatalogoStore'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const favoritosStore = useFavoritosStore()
const votosStore = useVotosStore()
const catalogoStore = useCatalogoStore()

const isLoading = ref(false)
const isError = ref(false)

const URL_DESTACADAS = 'https://6a31d6a07bc5e1c612663f52.mockapi.io/destacadas'

// ── Destacadas ──────────────────────────────────────────────────
const destacadas = ref([]) // [{ id, peliculaId }]
const guardando = ref(false)
const guardadoOk = ref(false)

async function fetchDestacadas() {
  const res = await fetch(URL_DESTACADAS)
  destacadas.value = await res.json()
}

// Para cada slot (0,1,2) el peliculaId elegido
const seleccion = ref([null, null, null])

// Cuando cargan las destacadas, sincronizamos la selección
function sincronizarSeleccion() {
  destacadas.value.forEach((d, i) => {
    if (i < 3) seleccion.value[i] = d.peliculaId
  })
}

async function guardarDestacadas() {
  try {
    guardando.value = true
    guardadoOk.value = false
    // PUT a cada registro existente con el nuevo peliculaId
    await Promise.all(
      destacadas.value.map((d, i) =>
        fetch(`${URL_DESTACADAS}/${d.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ peliculaId: Number(seleccion.value[i]) })
        })
      )
    )
    await fetchDestacadas()
    guardadoOk.value = true
    setTimeout(() => guardadoOk.value = false, 2500)
  } finally {
    guardando.value = false
  }
}

// Película seleccionada para cada slot
function peliculaDeSlot(i) {
  return catalogoStore.contenido.find(p => p.id === Number(seleccion.value[i])) || null
}

onMounted(async () => {
  try {
    isLoading.value = true
    await Promise.all([
      favoritosStore.fetchFavoritos(),
      votosStore.fetchVotos(),
      catalogoStore.fetchCatalogo(),
      fetchDestacadas()
    ])
    sincronizarSeleccion()
  } catch {
    isError.value = true
  } finally {
    isLoading.value = false
  }
})

// ── Favoritos ───────────────────────────────────────────────────
const datosFavoritos = computed(() => {
  const conteo = {}
  favoritosStore.favoritos.forEach(f => {
    const titulo = f.titulo || `ID ${f.peliculaId}`
    conteo[titulo] = (conteo[titulo] || 0) + 1
  })
  return Object.entries(conteo)
    .map(([titulo, cantidad]) => ({ titulo, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
})

const chartFavoritos = computed(() => ({
  labels: datosFavoritos.value.map(d => d.titulo),
  datasets: [{
    label: 'Veces guardada',
    data: datosFavoritos.value.map(d => d.cantidad),
    backgroundColor: 'rgba(212, 46, 148, 0.7)',
    borderColor: 'rgba(212, 46, 148, 1)',
    borderWidth: 1,
    borderRadius: 6,
  }]
}))

// ── Votos ───────────────────────────────────────────────────────
const datosVotos = computed(() => {
  const acumulador = {}
  votosStore.votos.forEach(v => {
    const titulo = v.titulo || `ID ${v.peliculaId}`
    if (!acumulador[titulo]) {
      acumulador[titulo] = { titulo, cantidad: 0, suma: 0 }
    }
    acumulador[titulo].cantidad++
    acumulador[titulo].suma += Number(v.puntuacion)
  })
  return Object.values(acumulador)
    .map(d => ({ ...d, promedio: (d.suma / d.cantidad).toFixed(1) }))
    .sort((a, b) => b.cantidad - a.cantidad)
})

const chartVotos = computed(() => ({
  labels: datosVotos.value.map(d => d.titulo),
  datasets: [{
    label: 'Cantidad de votos',
    data: datosVotos.value.map(d => d.cantidad),
    backgroundColor: 'rgba(100, 60, 200, 0.7)',
    borderColor: 'rgba(120, 80, 220, 1)',
    borderWidth: 1,
    borderRadius: 6,
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1a1a1a',
      borderColor: '#333',
      borderWidth: 1,
      titleColor: '#f0e6f6',
      bodyColor: '#7a6e82',
      padding: 10,
    }
  },
  scales: {
    x: {
      ticks: { color: '#7a6e82', font: { family: 'DM Sans', size: 12 } },
      grid: { color: 'rgba(255,255,255,0.04)' },
    },
    y: {
      beginAtZero: true,
      ticks: { color: '#7a6e82', stepSize: 1, font: { family: 'DM Sans', size: 12 } },
      grid: { color: 'rgba(255,255,255,0.06)' },
    }
  }
}

// Stats rápidas
const totalFavoritos = computed(() => favoritosStore.favoritos.length)
const totalVotos = computed(() => votosStore.votos.length)
const peliculaMasFavoritada = computed(() => datosFavoritos.value[0]?.titulo || '—')
const peliculaMasVotada = computed(() => datosVotos.value[0]?.titulo || '—')
</script>

<template>
  <div class="admin">

    <div class="admin-header">
      <div>
        <h1>Panel de Administración</h1>
        <p class="subtitulo">Estadísticas de actividad de la comunidad</p>
      </div>
    </div>

    <div v-if="isLoading" class="estado">
      <div class="spinner"></div>
      <p>Cargando datos...</p>
    </div>

    <div v-if="isError" class="error-banner">
      <p>⚠️ Error al cargar los datos</p>
      <button @click="isError = false" class="boton">Cerrar</button>
    </div>

    <template v-if="!isLoading && !isError">

      <!-- Stats rápidas -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-num">{{ totalFavoritos }}</span>
          <span class="stat-label">Favoritos totales</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ totalVotos }}</span>
          <span class="stat-label">Votos totales</span>
        </div>
        <div class="stat-card stat-card--highlight">
          <span class="stat-num stat-num--sm">{{ peliculaMasFavoritada }}</span>
          <span class="stat-label">Más veces en favoritos</span>
        </div>
        <div class="stat-card stat-card--highlight">
          <span class="stat-num stat-num--sm">{{ peliculaMasVotada }}</span>
          <span class="stat-label">Más votada</span>
        </div>
      </div>

      <!-- Destacadas del día -->
      <div class="seccion">
        <div class="seccion-head">
          <h2 class="seccion-titulo">🎯 Destacadas del día</h2>
          <span class="seccion-badge">3 slots</span>
        </div>

        <div class="destacadas-grid">
          <div v-for="(_, i) in 3" :key="i" class="slot">
            <div class="slot-preview" :style="peliculaDeSlot(i) ? { backgroundImage: `url(${peliculaDeSlot(i).poster})` } : {}">
              <div class="slot-overlay">
                <span v-if="peliculaDeSlot(i)" class="slot-titulo">{{ peliculaDeSlot(i).titulo }}</span>
                <span v-else class="slot-vacio">Sin selección</span>
              </div>
              <span class="slot-num">#{{ i + 1 }}</span>
            </div>
            <select v-model="seleccion[i]" class="slot-select">
              <option disabled value="null">Elegir película...</option>
              <optgroup label="Películas">
                <option v-for="p in catalogoStore.peliculas" :key="p.id" :value="p.id">
                  {{ p.titulo }}
                </option>
              </optgroup>
              <optgroup label="Series">
                <option v-for="s in catalogoStore.series" :key="s.id" :value="s.id">
                  {{ s.titulo }}
                </option>
              </optgroup>
            </select>
          </div>
        </div>

        <div class="destacadas-footer">
          <div v-if="guardadoOk" class="guardado-ok">✅ Destacadas actualizadas</div>
          <button class="boton" @click="guardarDestacadas" :disabled="guardando">
            <span v-if="guardando" class="spinner-sm"></span>
            {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>
      </div>

      <!-- Gráfico favoritos -->
      <div class="seccion">
        <div class="seccion-head">
          <h2 class="seccion-titulo">❤️ Favoritos por película</h2>
          <span class="seccion-badge">{{ datosFavoritos.length }} títulos</span>
        </div>

        <div v-if="datosFavoritos.length === 0" class="vacio">
          <p>Todavía no hay favoritos guardados</p>
        </div>
        <div v-else class="chart-wrap">
          <Bar :data="chartFavoritos" :options="chartOptions" />
        </div>

        <div v-if="datosFavoritos.length > 0" class="tabla">
          <div class="tabla-row tabla-row--head">
            <span>#</span>
            <span>Película / Serie</span>
            <span>Veces guardada</span>
          </div>
          <div v-for="(item, i) in datosFavoritos" :key="item.titulo" class="tabla-row">
            <span class="pos">{{ i + 1 }}</span>
            <span class="tabla-titulo">{{ item.titulo }}</span>
            <span class="tabla-cnt">
              <span class="barra-inline" :style="{ width: (item.cantidad / datosFavoritos[0].cantidad * 100) + '%' }"></span>
              {{ item.cantidad }}
            </span>
          </div>
        </div>
      </div>

      <!-- Gráfico votos -->
      <div class="seccion">
        <div class="seccion-head">
          <h2 class="seccion-titulo">⭐ Votos por película</h2>
          <span class="seccion-badge">{{ datosVotos.length }} títulos</span>
        </div>

        <div v-if="datosVotos.length === 0" class="vacio">
          <p>Todavía no hay votos registrados</p>
        </div>
        <div v-else class="chart-wrap">
          <Bar :data="chartVotos" :options="chartOptions" />
        </div>

        <div v-if="datosVotos.length > 0" class="tabla">
          <div class="tabla-row tabla-row--head">
            <span>#</span>
            <span>Película / Serie</span>
            <span>Cantidad de votos</span>
            <span>Promedio</span>
          </div>
          <div v-for="(item, i) in datosVotos" :key="item.titulo" class="tabla-row">
            <span class="pos">{{ i + 1 }}</span>
            <span class="tabla-titulo">{{ item.titulo }}</span>
            <span class="tabla-cnt">
              <span class="barra-inline barra-inline--votos" :style="{ width: (item.cantidad / datosVotos[0].cantidad * 100) + '%' }"></span>
              {{ item.cantidad }}
            </span>
            <span class="chip-promedio">⭐ {{ item.promedio }}</span>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<style scoped>
.admin {
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.subtitulo {
  font-size: 14px;
  color: var(--texto-suave);
  margin-top: 0.25rem;
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  background: var(--fondo-card);
  border: 1px solid var(--borde);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-card--highlight {
  border-color: rgba(212, 46, 148, 0.2);
  background: rgba(212, 46, 148, 0.04);
}

.stat-num {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.5rem;
  color: var(--acento);
  letter-spacing: 1px;
  line-height: 1;
}

.stat-num--sm {
  font-size: 1.1rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  color: var(--texto);
  letter-spacing: 0;
}

.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--texto-suave);
  margin-top: 0.15rem;
}

/* Sección */
.seccion {
  background: var(--fondo-card);
  border: 1px solid var(--borde);
  border-radius: 14px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.seccion-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.seccion-titulo {
  font-size: 1.1rem;
  letter-spacing: 1px;
  color: var(--texto);
}

.seccion-badge {
  font-size: 11px;
  color: var(--texto-suave);
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--borde);
  padding: 2px 10px;
  border-radius: 20px;
}

/* Destacadas */
.destacadas-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.slot {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.slot-preview {
  height: 160px;
  border-radius: 10px;
  background: var(--borde);
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--borde);
}

.slot-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%);
  display: flex;
  align-items: flex-end;
  padding: 0.75rem;
}

.slot-titulo {
  font-size: 13px;
  font-weight: 600;
  color: white;
  line-height: 1.3;
}

.slot-vacio {
  font-size: 12px;
  color: var(--texto-suave);
}

.slot-num {
  position: absolute;
  top: 8px;
  left: 8px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1rem;
  color: white;
  background: var(--acento);
  padding: 1px 8px;
  border-radius: 4px;
  letter-spacing: 1px;
}

.slot-select {
  width: 100%;
  font-size: 13px;
}

.destacadas-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}

.guardado-ok {
  font-size: 13px;
  color: #2ecc71;
  background: rgba(39,174,96,0.1);
  border: 1px solid rgba(39,174,96,0.25);
  padding: 0.4rem 1rem;
  border-radius: 8px;
}

.spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  margin-right: 0.4rem;
  vertical-align: middle;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Gráfico */
.chart-wrap {
  height: 260px;
  position: relative;
}

/* Tabla */
.tabla {
  border: 1px solid var(--borde);
  border-radius: 10px;
  overflow: hidden;
}

.tabla-row {
  display: grid;
  grid-template-columns: 36px 1fr 200px 80px;
  align-items: center;
  gap: 1rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--borde);
  font-size: 14px;
}

.chip-promedio {
  font-size: 13px;
  font-weight: 600;
  color: var(--texto);
}

.tabla-row:last-child { border-bottom: none; }

.tabla-row--head {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--texto-suave);
  background: rgba(255,255,255,0.02);
  padding: 0.5rem 1rem;
}

.pos {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1rem;
  color: var(--acento);
}

.tabla-titulo {
  color: var(--texto);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tabla-cnt {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--texto-suave);
  font-size: 13px;
}

.barra-inline {
  height: 6px;
  background: rgba(212, 46, 148, 0.5);
  border-radius: 3px;
  flex-shrink: 0;
  max-width: 120px;
}

.barra-inline--votos {
  background: rgba(100, 60, 200, 0.5);
}

.estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 5rem;
  color: var(--texto-suave);
}

.vacio {
  padding: 2rem;
  text-align: center;
  color: var(--texto-suave);
  font-size: 14px;
}

@media (max-width: 768px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .destacadas-grid { grid-template-columns: 1fr; }
  .tabla-row { grid-template-columns: 28px 1fr auto; }
}
</style>