import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";

const URL_FAVORITOS = 'https://6a03ce8d2afe8349b4b583b8.mockapi.io/favoritos'

export const useFavoritosStore = defineStore('favoritos', () => {

const favoritos = ref([])

async function fetchFavoritos() {
    const authStore = useAuthStore()
    const respuesta = await fetch(URL_FAVORITOS)
    const todos = await respuesta.json()
    if(authStore.esAdmin){
        favoritos.value = todos
    }else{
        favoritos.value = todos.filter(f => f.usuarioId === authStore.usuarioLogueado?.id)
    }
    
}


return { favoritos, fetchFavoritos}
})