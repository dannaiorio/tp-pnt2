<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const contenido = ref([])
const isLoading = ref(false)
const isError = ref(false)
const busqueda = ref('')

onMounted(() => getCatalogo()) // onMounted para cargar el catálogo al montar el componente

async function getCatalogo() {
  try {
    isLoading.value = true
    isError.value = false
    const respuesta = await fetch('https://www.mockachino.com/99371521-7de7-47/catalogos')
    const datos = await respuesta.json()
    contenido.value = [...datos.peliculas, ...datos.series]
  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

const contenidoFiltrado = computed(() =>
  contenido.value.filter(item =>
    item.titulo.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)
</script>

<template>
  <div class="catalogo">
    <h1>Catálogo</h1>
    <input type="text" v-model="busqueda" placeholder="Buscar..." />
    <p v-if="isLoading">Cargando...</p>
    <div v-if="isError">
      <button @click="isError = false">Cerrar</button>
      <p>Error al cargar el catálogo</p>
    </div>

    <h2>{{ contenidoFiltrado.length }} resultados</h2>

    <div class="grilla">
      <div v-for="item in contenidoFiltrado" :key="item.id" class="tarjeta"
        @click="router.push('/detalle/' + item.id)"> <!-- Navega al detalle del item al hacer click -->
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
</style>