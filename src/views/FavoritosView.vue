<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useFavoritosStore } from "@/stores/useFavoritosStore";
import TarjetaContenido from '@/components/TarjetaContenido.vue';

const favoritosStore = useFavoritosStore();
const router = useRouter();

const URL_FAVORITOS = "https://6a03ce8d2afe8349b4b583b8.mockapi.io/favoritos";
const isLoading = ref(false);
const isError = ref(false);

const irAlCatalogo = () => {
  router.push("/catalogo"); // Navega al catálogo
};

onMounted(() => cargar());

async function cargar() {
  try {
    isLoading.value = true;
    isError.value = false;
    await favoritosStore.fetchFavoritos();
  } catch (error) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
}

async function eliminarFavorito(id) {
    await fetch(`${URL_FAVORITOS}/${id}`, {
    method: 'DELETE'
    })
    await favoritosStore.fetchFavoritos()
}

</script>

<template>
  <div class="favoritos">
    <h1>Favoritos</h1>
    <p><router-link to="/" class="botonHome">Volver al Home</router-link></p>
    <p v-if="isLoading">Cargando...</p>

    <div v-if="isError">
      <button @click="isError = false">Cerrar</button>
      <p>Error al cargar favoritos</p>
    </div>

    <p v-if="!isLoading && !isError && favoritosStore.favoritos.length === 0">
      No tenés favoritos agregados
    </p>

    <div v-if="!isLoading && !isError && favoritosStore.favoritos.length > 0" class="grilla">
    <TarjetaContenido
    v-for="item in favoritosStore.favoritos"
    :key="item.id"
    :item="item"
    :mostrarEliminar="true"
    @eliminar="eliminarFavorito"
  />
    </div>

    <button @click="irAlCatalogo" class="boton">Ir al catálogo</button>
  </div>
</template>

<style scoped>
.favoritos {
  padding: 1rem;
}

.grilla {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}


.boton-eliminar {
  width: 100%;
  padding: 0.4rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 12px;
}

.botonHome {
  background: rgb(236, 61, 96);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
}
</style>