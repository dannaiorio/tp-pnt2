<script setup>

import { ref, computed, onMounted } from 'vue';
import { useCatalogoStore } from '@/stores/useCatalogoStore';

const catalogoStore = useCatalogoStore()
const isLoading = ref(false)
const isError = ref(false)

onMounted(()=> getCatalogo())

async function getCatalogo(){
  try {
    isLoading.value = true
    isError.value = false
    await catalogoStore.fetchCatalogo()
  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

const top5 = computed(()=>
  
  [...catalogoStore.contenido]
  .sort((a,b)=> b.puntuacion - a.puntuacion)
  .slice(0,5)
    
)

</script>

<template>
  <div class="Home">
    <h1>Cine</h1>

    <h3>Top Mejores Peliculas y Series</h3>
    <p v-if="isLoading">Cargando...</p>
    <div v-if="isError">
      <button @click="isError = false">Cerrar</button>
      <p>Error al cargar</p>
    </div>

    <div v-for="t in top5" :key="t.id">
      <img :src="t.poster" :alt="t.titulo" />
        <h2>{{ t.titulo }}</h2>
        <p>⭐ {{ t.puntuacion }}</p>
    </div>

    <div class="botones">

      <router-link to="/catalogo" class="boton">Ir al catalogos</router-link>
      <router-link to="/favoritos" class="boton">Mis favoritos</router-link>

    </div>
  </div>
</template>

<style scoped>

.home{
  padding: 30px;
}

.botones{
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.boton{
  background: rgb(236, 61, 96);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
}

</style>
