<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useCatalogoStore } from "@/stores/useCatalogoStore";
import { filtrar } from "@/utils/filtrar";

const catalogoStore = useCatalogoStore();
const router = useRouter();


const isLoading = ref(false);
const isError = ref(false);


const busqueda = ref('');
const generoSeleccionado = ref('');
const añoSeleccionado = ref('');

const irAFavoritos = () => {
  router.push("/favoritos"); 
};
const irARanking = () => {
  router.push("/ranking"); 
};

onMounted(() => cargar()); 

async function cargar() {
  try {
    isLoading.value = true;
    isError.value = false;
    await catalogoStore.fetchCatalogo();
  } catch (error) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
}

function limpiar() {
  busqueda.value = '';
  generoSeleccionado.value = '';
  añoSeleccionado.value = '';
}

const contenidoFiltrado = computed(() =>
  filtrar(catalogoStore.contenido, { busqueda: busqueda.value, generoSeleccionado: generoSeleccionado.value, añoSeleccionado: añoSeleccionado.value })
)
</script>

<template>
  <div class="catalogo">
    <h1>Catálogo</h1>
    <p><router-link to="/" class="botonHome">Volver al Home</router-link></p>
    <!-- Barra de búsqueda avanzada -->
    <input type="text" v-model="busqueda" placeholder="Buscar por título..." />

    <select v-model="generoSeleccionado">
      <option value="">Todos los géneros</option>
      <option v-for="g in catalogoStore.generos" :key="g" :value="g">{{ g }}</option>
    </select>

    <select v-model="añoSeleccionado">
      <option value="">Todos los años</option>
      <option v-for="a in catalogoStore.años" :key="a" :value="a">{{ a }}</option>
    </select>

    <button @click="limpiar" class="boton">Limpiar filtros</button>

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

.botonHome {
  background: rgb(236, 61, 96);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
}

</style>