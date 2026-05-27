import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const URL_CATALOGO = 'https://www.mockachino.com/99371521-7de7-47/catalogos'

export const useCatalogoStore = defineStore('catalogo', () => {

const peliculas = ref([])
const series = ref([])
const contenido = computed(()=>[...peliculas.value,...series.value])

async function fetchCatalogo() {
    const respuesta = await fetch(URL_CATALOGO)
    const datos = await respuesta.json()
    peliculas.value = datos.peliculas
    series.value = datos.series
}


const generos = computed(() => [...new Set(contenido.value.map(i => i.genero))])
const años = computed(() => [...new Set(contenido.value.map(i => i.año))].sort((a, b) => b - a))

return { contenido, fetchCatalogo, generos, años, peliculas, series }
})