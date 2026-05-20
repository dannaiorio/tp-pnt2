<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useBusquedaStore } from "@/stores/useBusquedaStore";

const busquedaStore = useBusquedaStore();
const router = useRouter();

const contenido = ref([]);
const isLoading = ref(false);
const isError = ref(false);


const irAFavoritos = () => {
  router.push("/favoritos"); // Navega a la lista de favoritos
};
const irARanking = () => {
  router.push("/ranking"); // Navega al ranking
};

onMounted(() => getCatalogo()); // onMounted para cargar el catálogo al montar el componente

async function getCatalogo() {
  try {
    isLoading.value = true;
    isError.value = false;
    const respuesta = await fetch(
      "https://www.mockachino.com/99371521-7de7-47/catalogos",
    );
    const datos = await respuesta.json();
    contenido.value = [...datos.peliculas, ...datos.series];
  } catch (error) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
}

// PASAR A STORE
const generos = computed(() => [...new Set(contenido.value.map(i => i.genero))])
const años = computed(() => [...new Set(contenido.value.map(i => i.año))].sort((a, b) => b - a))

// Usa el store para filtrar
const contenidoFiltrado = computed(() => busquedaStore.filtrar(contenido.value))
</script>

<template>
  <div class="catalogo">
    <h1>Catálogo</h1>

    <!-- Barra de búsqueda avanzada -->
    <input type="text" v-model="busquedaStore.busqueda" placeholder="Buscar por título..." />

    <select v-model="busquedaStore.generoSeleccionado">
      <option value="">Todos los géneros</option>
      <option v-for="g in generos" :key="g" :value="g">{{ g }}</option>
    </select>

    <select v-model="busquedaStore.añoSeleccionado">
      <option value="">Todos los años</option>
      <option v-for="a in años" :key="a" :value="a">{{ a }}</option>
    </select>

    <button @click="busquedaStore.limpiar" class="boton">Limpiar filtros</button>

    <p v-if="isLoading">Cargando...</p>
    <div v-if="isError">
      <button @click="isError = false">Cerrar</button>
      <p>Error al cargar el catálogo</p>
    </div>

    <h2>{{ contenidoFiltrado.length }} resultados</h2>

    <p>
      <button @click="irAFavoritos" class="boton">Ver favoritos ❤️</button>
    </p>
    <p>
      <button @click="irARanking" class="boton">Ver ranking 🏆</button>
    </p>

    <div class="grilla">
      <div
        v-for="item in contenidoFiltrado"
        :key="item.id"
        class="tarjeta"
        @click="router.push('/detalle/' + item.id)"
      >
        <img :src="item.poster" :alt="item.titulo" />
        <h2>{{ item.titulo }}</h2>
        <p>{{ item.año }} | {{ item.genero }}</p>
        <p>⭐ {{ item.puntuacion }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalogo {
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

  display: flex;
  flex-direction: column;
}

.tarjeta img {
  width: 100%;
  height: 300px;
  object-fit: cover;
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
</style>
