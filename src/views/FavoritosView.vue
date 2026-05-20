<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useFavoritosStore } from "@/stores/useFavoritosStore";

const store = useFavoritosStore();
const router = useRouter();

const irAlCatalogo = () => {
  router.push("/catalogo"); // Navega al catálogo
};


onMounted(() => store.fetchFavoritos());

</script>

<template>
  <div class="favoritos">
    <h1>Favoritos</h1>

    <p v-if="store.isLoading">Cargando...</p>

    <div v-if="store.isError">
      <button @click="store.isError = false">Cerrar</button>
      <p>Error al cargar favoritos</p>
    </div>

    <p v-if="!store.isLoading && !store.isError && store.favoritos.length === 0">
      No tenés favoritos agregados
    </p>

    <div v-if="!store.isLoading && !store.isError && store.favoritos.length > 0" class="grilla">
      <div
        v-for="item in store.favoritos"
        :key="item.id"
        class="tarjeta"
      >
        <img :src="item.poster" :alt="item.titulo" @click="router.push(`/detalle/${item.peliculaId || item.id}`)" />
        <h2>{{ item.titulo }}</h2>
        <p>{{ item.año }} | {{ item.genero }}</p>
        <p>⭐ {{ item.puntuacion }}</p>
        <button class="boton-eliminar" @click="store.eliminarFavorito(item.id)">
          🗑 Eliminar
        </button>
      </div>
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

.tarjeta {
  background: #1a1a1a;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
}

.tarjeta img {
  width: 100%;
  height: auto;
}

.tarjeta h2 {
  font-size: 14px;
  padding: 0.5rem;
  margin: 0;
}

.tarjeta p {
  font-size: 12px;
  color: #aaa;
  margin: 0;
  padding: 0 0.5rem 0.5rem;
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
</style>
