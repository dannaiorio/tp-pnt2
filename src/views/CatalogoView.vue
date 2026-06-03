<script setup>
import { ref, onMounted, computed } from "vue"
import { useCatalogoStore } from "@/stores/useCatalogoStore"
import { useFiltrar } from "@/composables/useFiltrar"
import TarjetaContenido from '@/components/TarjetaContenido.vue'
 
const catalogoStore = useCatalogoStore()
const { filtrar } = useFiltrar()
 
const isLoading = ref(false)
const isError = ref(false)
const busqueda = ref('')
const generoSeleccionado = ref('')
const añoSeleccionado = ref('')
const tipoSeleccionado = ref('')
 
onMounted(async () => {
  try {
    isLoading.value = true
    await catalogoStore.fetchCatalogo()
  } catch { isError.value = true }
  finally { isLoading.value = false }
})
 
function limpiar() {
  busqueda.value = ''
  generoSeleccionado.value = ''
  añoSeleccionado.value = ''
  tipoSeleccionado.value = ''
}
 
const contenidoFiltrado = computed(() => {
  let resultado = catalogoStore.contenido
  if (tipoSeleccionado.value === 'pelicula') resultado = catalogoStore.peliculas
  if (tipoSeleccionado.value === 'serie') resultado = catalogoStore.series
  return filtrar(resultado, {
    busqueda: busqueda.value,
    generoSeleccionado: generoSeleccionado.value,
    añoSeleccionado: añoSeleccionado.value
  })
})

const generosFiltrados = computed(() => {
  let base = catalogoStore.contenido
  if (añoSeleccionado.value)
    base = base.filter(i => i.año === añoSeleccionado.value)
  return [...new Set(base.map(i => i.genero))].sort()
})

const añosFiltrados = computed(() => {
  let base = catalogoStore.contenido
  if (generoSeleccionado.value)
    base = base.filter(i => i.genero === generoSeleccionado.value)
  return [...new Set(base.map(i => i.año))].sort((a, b) => b - a)
})
</script>
 
<template>
  <div class="catalogo">
    <div class="page-header">
      <h1>Catálogo</h1>
      <p class="subtitulo">{{ catalogoStore.contenido.length }} títulos disponibles</p>
    </div>
 
    <div class="filtros">
      <input type="text" v-model="busqueda" placeholder="🔍  Buscar por título..." class="input-busqueda" />
      <select v-model="tipoSeleccionado">
  <option value="">Todos</option>
  <option value="pelicula">Películas</option>
  <option value="serie">Series</option>
</select>
      <select v-model="generoSeleccionado">
        <option value="">Todos los géneros</option>
        <option v-for="g in generosFiltrados" :key="g" :value="g">{{ g }}</option>
      </select>
      <select v-model="añoSeleccionado">
        <option value="">Todos los años</option>
        <option v-for="a in añosFiltrados" :key="a" :value="a">{{ a }}</option>
      </select>
      <button @click="limpiar" class="boton-secundario">✕ Limpiar</button>
    </div>
 
    <div v-if="isLoading" class="estado">
      <div class="spinner"></div>
      <p>Cargando catálogo...</p>
    </div>
 
    <div v-if="isError" class="error-banner" style="margin-bottom:1.5rem">
      <p>⚠️ Error al cargar</p>
      <button @click="isError = false" class="boton">Cerrar</button>
    </div>
 
    <p v-if="!isLoading" class="resultados-count">{{ contenidoFiltrado.length }} resultados</p>
 
    <div v-if="!isLoading && contenidoFiltrado.length === 0" class="vacio">
      <div class="vacio-icono">🎬</div>
      <h2>Sin resultados</h2>
      <p>Probá con otros filtros</p>
      <button @click="limpiar" class="boton">Limpiar filtros</button>
    </div>
 
    <div v-if="!isLoading" class="grilla">
      <TarjetaContenido
        v-for="item in contenidoFiltrado"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>
 
<style scoped>
.catalogo { padding: 2rem; max-width: 1400px; margin: 0 auto; }
.page-header { margin-bottom: 1.75rem; }
.subtitulo { color: var(--texto-suave); font-size: 14px; margin-top: 0.25rem; }
.filtros {
  display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;
  margin-bottom: 1.5rem; padding: 1.25rem;
  background: var(--fondo-card); border-radius: 12px; border: 1px solid var(--borde);
}
.input-busqueda { flex: 1; min-width: 200px; }
.resultados-count { font-size: 13px; color: var(--texto-suave); margin-bottom: 1.25rem; }
.grilla {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem; align-items: start;
}
.estado {
  display: flex; flex-direction: column; align-items: center;
  gap: 1rem; padding: 4rem; color: var(--texto-suave);
}
.vacio {
  text-align: center; padding: 4rem 2rem;
  display: flex; flex-direction: column; align-items: center;
  gap: 0.75rem; color: var(--texto-suave);
}
.vacio-icono { font-size: 3rem; opacity: 0.4; }
.vacio h2 { font-family: 'DM Sans', sans-serif; font-size: 1.2rem; color: var(--texto); }
</style>