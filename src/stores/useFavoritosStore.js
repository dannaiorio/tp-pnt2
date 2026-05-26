import { defineStore } from "pinia";
import { ref } from "vue";

const URL_FAVORITOS = 'https://6a03ce8d2afe8349b4b583b8.mockapi.io/favoritos'

export const useFavoritosStore = defineStore('favoritos', () => {

const favoritos = ref([])

async function fetchFavoritos() {
    const respuesta = await fetch(URL_FAVORITOS)
    favoritos.value = await respuesta.json()
}


return { favoritos, fetchFavoritos}
})