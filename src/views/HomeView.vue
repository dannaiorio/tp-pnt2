<script setup>

import { ref, computed, onMounted } from 'vue';
import { useCatalogoStore } from '@/stores/useCatalogoStore';
import TarjetaContenido from '@/components/TarjetaContenido.vue';

const catalogoStore = useCatalogoStore()
const isLoading = ref(false)
const isError = ref(false)

onMounted(()=> cargar())

async function cargar(){
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

const top5Peliculas = computed(()=>
  
  [...catalogoStore.peliculas]

  .sort((a,b)=> b.puntuacion - a.puntuacion)
  .slice(0,5)
    
)

const top5Series = computed(()=>
  
  [...catalogoStore.series]

  .sort((a,b)=> b.puntuacion - a.puntuacion)
  .slice(0,5)
    
)

</script>

<template>
  <div class="Home">
    <h1>Cine</h1>

    <p v-if="isLoading">Cargando...</p>
    <div v-if="isError">
      <button @click="isError = false">Cerrar</button>
      <p>Error al cargar</p>
    </div>

  <h3>Top 5 Películas</h3>
    <div class="grilla">
      <TarjetaContenido
        v-for="t in top5Peliculas"
        :key="t.id"
        :item="t"
      />
    </div>

    <h3>Top 5 Series</h3>
    <div class="grilla">
      <TarjetaContenido
        v-for="t in top5Series"
        :key="t.id"
        :item="t"
      />
    </div>

    <div class="botones">
      <router-link to="/catalogo" class="boton">Ir al catálogo</router-link>
      <router-link to="/favoritos" class="boton">Mis favoritos</router-link>
    </div>
  </div> 
</template>

<style scoped>
.Home {
  padding: 30px;
}

.grilla {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}


.botones {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.boton {
  background: rgb(236, 61, 96);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
}
</style>
