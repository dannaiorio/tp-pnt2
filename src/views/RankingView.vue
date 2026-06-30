<script setup>
import { ref, onMounted, computed } from "vue";
import { useVotosStore } from "../stores/useVotosStore";
import { useFiltrar } from "@/composables/useFiltrar";
import TarjetaContenido from '@/components/TarjetaContenido.vue';
 import { useCatalogoStore } from '@/stores/useCatalogoStore'


const store = useVotosStore();
const { filtrar } = useFiltrar();
const isLoading = ref(false);
const isError = ref(false);
const busqueda = ref('');
const catalogoStore = useCatalogoStore()
 
onMounted(async () => {
  try {
    isLoading.value = true
    await Promise.all([
      catalogoStore.fetchCatalogo(),
      cargar()
    ])
  } catch {
    isError.value = true
  } finally {
    isLoading.value = false
  }
})
 
async function cargar() {
  await store.fetchVotos();
}


const rankingPeliculas = computed(() => {

  const ids = new Set(catalogoStore.peliculas.map(p => String(p.id)))
  return filtrar(store.ranking.filter(voto => ids.has(String(voto.peliculaId))),{ busqueda: busqueda.value, generoSeleccionado:'', añoSeleccionado:''}).slice(0, 10)
})

const rankingSeries = computed(() => {
  const ids = new Set(catalogoStore.series.map(s => String(s.id)))
  return filtrar(store.ranking.filter(i => ids.has(String(i.peliculaId))), { busqueda: busqueda.value, generoSeleccionado: '', añoSeleccionado: '' }).slice(0, 10)
})

</script>
 
<template>
  <div class="ranking">
    <div class="page-header">
      <h1>Ranking</h1>
      <p class="subtitulo">Los títulos más votados por la comunidad</p>
    </div>
 
    <!-- Filtro -->
    <div class="filtros">
      <input type="text" v-model="busqueda" placeholder="🔍  Buscar en el ranking..." class="input-busqueda" />
      <button @click="busqueda = ''" class="boton-secundario">✕ Limpiar</button>
    </div>
 
  
    <div v-if="isLoading" class="estado">
      <div class="spinner"></div>
      <p>Cargando ranking...</p>
    </div>
 
    <div v-if="isError" class="error-banner">
      <p>⚠️ Error al cargar el ranking</p>
      <button @click="cargar" class="boton">Reintentar</button>
    </div>
 
    <div v-if="!isLoading && !isError && rankingPeliculas.length === 0 && rankingSeries.length === 0" class="vacio">
      <div class="vacio-icono">🏆</div>
      <h2>Todavía no hay votos cargados</h2>
      <p>Votá desde el detalle de cada película o serie</p>
      <router-link to="/catalogo" class="boton">Ir al catálogo</router-link>
    </div>
 
    <div v-if="!isLoading && !isError">
     <h2>🎬 Películas</h2>
  <p v-if="rankingPeliculas.length === 0">No hay votos de películas todavía.</p>
  <div class="grilla">
    <TarjetaContenido
      v-for="(item, index) in rankingPeliculas"
      :key="item.peliculaId"
      :item="item"
      :posicion="index + 1"
    />
  </div>

  <h2 style="margin-top: 2rem">📺 Series</h2>
  <p v-if="rankingSeries.length === 0">No hay votos de series todavía.</p>
  <div class="grilla">
    <TarjetaContenido
      v-for="(item, index) in rankingSeries"
      :key="item.peliculaId"
      :item="item"
      :posicion="index + 1"
    />
  </div>
  </div>
   </div> 
</template>
 
<style scoped>
.ranking {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}
 
.page-header {
  margin-bottom: 1.75rem;
}
 
.subtitulo {
  color: var(--texto-suave);
  font-size: 14px;
  margin-top: 0.25rem;
}
 
.filtros {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;
}
 
.input-busqueda {
  flex: 1;
  max-width: 400px;
}
 
.grilla {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}
 
.estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem;
  color: var(--texto-suave);
}
 
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--borde);
  border-top-color: var(--acento);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
 
@keyframes spin { to { transform: rotate(360deg); } }
 
.error-banner {
  margin-bottom: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
 
.vacio {
  text-align: center;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--texto-suave);
}
 
.vacio-icono {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}
 
.vacio h2 {
  font-family: 'DM Sans', sans-serif;
  font-size: 1.2rem;
  color: var(--texto);
}
</style>
