<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const favoritos = ref([])
const isLoading = ref(false)
const isError = ref(false)
const router = useRouter()


const irAlCatalogo = () => {
  router.push('/catalogo')  // Navega al catálogo
}

onMounted(() => getFavoritos())

async function getFavoritos() {
  try {
    isLoading.value = true
    isError.value = false
    const respuesta = await fetch('https://6a03ce8d2afe8349b4b583b8.mockapi.io/favoritos')
    const datos = await respuesta.json()
    favoritos.value = datos
  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>


<template>
  <div class="favoritos">
    <h1>Favoritos</h1>

    <p v-if="isLoading">Cargando...</p>

    <div v-if="isError">
      <button @click="isError = false">Cerrar</button>
      <p>Error al cargar favoritos</p>
    </div>

    <p v-if="!isLoading && !isError && favoritos.length === 0">
      No tenés favoritos agregados
    </p>

    <div v-if="!isLoading && !isError && favoritos.length > 0" class="grilla">
      <div 
        v-for="item in favoritos" 
        :key="item.id" 
        class="tarjeta" 
        @click="router.push(`/detalle/${item.id}`)"
      >
        <img :src="item.poster" :alt="item.titulo" />
        <h2>{{ item.titulo }}</h2>
        <p>{{ item.año }} | {{ item.genero }}</p>
        <p>⭐ {{ item.puntuacion }}</p>
      </div>
    
    </div>
    <button @click="irAlCatalogo" class="boton">
        Ir al catálogo
      </button>
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
</style>