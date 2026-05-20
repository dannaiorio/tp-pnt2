import { defineStore } from "pinia";
import { ref } from "vue";

const URL_FAVORITOS = 'https://6a03ce8d2afe8349b4b583b8.mockapi.io/favoritos'
export const useFavoritosStore = defineStore('favoritos', () => {

const favoritos = ref([])
const isLoading = ref(false)
const isError = ref(false)


async function fetchFavoritos() {
    try {
isLoading.value = true
isError.value = false
const respuesta = await fetch(URL_FAVORITOS)
favoritos.value = await respuesta.json()
    } catch (error) {
    isError.value = true
    } finally {
    isLoading.value = false
    }
}

async function agregarFavorito(item) {
    const yaExiste = favoritos.value.some(f => f.peliculaId === item.id)
    if (yaExiste) {
    alert('Ya está en favoritos')
    return
    }
    await fetch(URL_FAVORITOS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...item, peliculaId: item.id })
    })
    await fetchFavoritos()
}

async function eliminarFavorito(id) {
    await fetch(`${URL_FAVORITOS}/${id}`, {
    method: 'DELETE'
    })
    await fetchFavoritos()
}

return { favoritos, isLoading, isError, fetchFavoritos, agregarFavorito, eliminarFavorito }
})