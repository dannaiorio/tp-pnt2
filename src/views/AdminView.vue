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
 
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)
 
const favoritosStore = useFavoritosStore()
const votosStore = useVotosStore()
 
const isLoading = ref(false)
const isError = ref(false)
 
onMounted(async () => {
  try {
    isLoading.value = true
    await Promise.all([
      favoritosStore.fetchFavoritos(),
      votosStore.fetchVotos()
    ])
  } catch {
    isError.value = true
  } finally {
    isLoading.value = false
  }
})
 
// ── Favoritos: nombre + cantidad de veces guardada ──────────────
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
  labels: datosFavoritos.value.map(d => d.titulo),  //array con los nombres que van en el eje X
  datasets: [{
    label: 'Veces guardada',
    data: datosFavoritos.value.map(d => d.cantidad),
    backgroundColor: 'rgba(212, 46, 148, 0.7)',
    borderColor: 'rgba(212, 46, 148, 1)',
    borderWidth: 1,
    borderRadius: 6,
  }]
}))
 
// ── Votos: nombre + cantidad de votos ──────────────────────────
const datosVotos = computed(() => {
  const conteo = {}
  votosStore.votos.forEach(v => {
    const titulo = v.titulo || `ID ${v.peliculaId}`
    conteo[titulo] = (conteo[titulo] || 0) + 1
  })
  return Object.entries(conteo)
    .map(([titulo, cantidad]) => ({ titulo, cantidad }))
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
 
        <!-- Tabla resumen -->
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
 
        <!-- Tabla resumen -->
        <div v-if="datosVotos.length > 0" class="tabla">
          <div class="tabla-row tabla-row--head">
            <span>#</span>
            <span>Película / Serie</span>
            <span>Cantidad de votos</span>
          </div>
          <div v-for="(item, i) in datosVotos" :key="item.titulo" class="tabla-row">
            <span class="pos">{{ i + 1 }}</span>
            <span class="tabla-titulo">{{ item.titulo }}</span>
            <span class="tabla-cnt">
              <span class="barra-inline barra-inline--votos" :style="{ width: (item.cantidad / datosVotos[0].cantidad * 100) + '%' }"></span>
              {{ item.cantidad }}
            </span>
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
 
.admin-header { }
 
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
  grid-template-columns: 36px 1fr 200px;
  align-items: center;
  gap: 1rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--borde);
  font-size: 14px;
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
  transition: width 0.3s;
}
 
.barra-inline--votos {
  background: rgba(100, 60, 200, 0.5);
}
 
/* Estado */
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
  .tabla-row { grid-template-columns: 28px 1fr auto; }
}
</style>