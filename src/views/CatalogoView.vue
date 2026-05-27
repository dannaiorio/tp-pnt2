<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useCatalogoStore } from "@/stores/useCatalogoStore";
import { useFiltrar } from "@/composables/useFiltrar";
import TarjetaContenido from '@/components/TarjetaContenido.vue'

const catalogoStore = useCatalogoStore();
const router = useRouter();
const { filtrar } = useFiltrar();

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
      <TarjetaContenido
        v-for="item in contenidoFiltrado"
        :key="item.id"
        :item="item"
      />
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
    align-items: start;
}



.botonHome {
  background: rgb(236, 61, 96);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
}

</style>