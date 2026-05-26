import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const URL_CATALOGO = 'https://www.mockachino.com/99371521-7de7-47/catalogos'

export const useCatalogoStore = defineStore('catalogo', () => {


const contenido = ref([])

async function fetchCatalogo() {
    const respuesta = await fetch(URL_CATALOGO)
    const datos = await respuesta.json()
    contenido.value = [...datos.peliculas, ...datos.series]
}


const generos = computed(() => [...new Set(contenido.value.map(i => i.genero))])
const años = computed(() => [...new Set(contenido.value.map(i => i.año))].sort((a, b) => b - a))

return { contenido, fetchCatalogo, generos, años }
})