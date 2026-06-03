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
  await fetch(`${URL_FAVORITOS}/${id}`, { method: 'DELETE' })
  await favoritosStore.fetchFavoritos()
}
</script>
 
<template>
  <div class="favoritos">
    <div class="page-header">
      <h1>Mis Favoritos</h1>
      <p class="subtitulo" v-if="!isLoading && favoritosStore.favoritos.length > 0">
        {{ favoritosStore.favoritos.length }} títulos guardados
      </p>
    </div>
 
    <div v-if="isLoading" class="estado">
      <div class="spinner"></div>
      <p>Cargando favoritos...</p>
    </div>
 
    <div v-if="isError" class="error-banner">
      <p>⚠️ Error al cargar favoritos</p>
      <button @click="isError = false" class="boton">Cerrar</button>
    </div>
 
    <!-- Estado vacío -->
    <div v-if="!isLoading && !isError && favoritosStore.favoritos.length === 0" class="vacio">
      <div class="vacio-icono">💔</div>
      <h2>Todavía no tenés favoritos</h2>
      <p>Explorá el catálogo y guardá los títulos que te gusten</p>
      <router-link to="/catalogo" class="boton">Ir al catálogo</router-link>
    </div>
 
    <div v-if="!isLoading && !isError && favoritosStore.favoritos.length > 0" class="grilla">
      <TarjetaContenido
        v-for="item in favoritosStore.favoritos"
        :key="item.id"
        :item="item"
        :mostrarEliminar="true"
        @eliminar="eliminarFavorito"
      />
    </div>
  </div>
</template>
 
<style scoped>
.favoritos {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}
 
.page-header {
  margin-bottom: 2rem;
}
 
.subtitulo {
  color: var(--texto-suave);
  font-size: 14px;
  margin-top: 0.25rem;
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
  font-size: 8rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}
 
.vacio h2 {
  font-family: 'DM Sans', sans-serif;
  font-size: 1.2rem;
  color: var(--texto);
}
 
.vacio p {
  font-size: 14px;
  margin-bottom: 0.5rem;
}
</style>