<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import vue3StarRatings from 'vue3-star-ratings'

const puntuacion = ref(0)
const route = useRoute()
const router = useRouter()
const item = ref(null)
const isLoading = ref(false)
const isError = ref(false)

const irAlCatalogo = () => {
  router.push('/catalogo')  // Navega al catálogo
}

onMounted(() => getDetalle())

async function getDetalle() {
  try {

    isLoading.value = true
    isError.value = false

    const respuesta = await fetch('https://www.mockachino.com/99371521-7de7-47/catalogos')
    const datos = await respuesta.json()

    const todo = [...datos.peliculas, ...datos.series]
    const id = parseInt(route.params.id)

  item.value = todo.find(el => el.id === id)
if (!item.value) {
  router.push('/catalogo')  // Si no se encuentra el item, redirige al catálogo
}
  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}


async function agregarFavorito() {
  try {
    await fetch('https://6a03ce8d2afe8349b4b583b8.mockapi.io/favoritos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:  JSON.stringify({
  ...item.value,
  puntuacion: puntuacion.value
})
    })
    alert('Agregado a favoritos')
  } catch (error) {
    alert('Error al agregar favorito')
  }
}

async function votarPelicula() {
  try {
    console.log('ITEM:', item.value)
    console.log('PUNTUACION:', puntuacion.value)

    const respuesta = await fetch('https://6a03ce8d2afe8349b4b583b8.mockapi.io/votos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        peliculaId: item.value.id,
        titulo: item.value.titulo,
        poster: item.value.poster,
        puntuacion: Number(puntuacion.value)
      })
    })

    console.log('RESPUESTA:', respuesta)

    if (!respuesta.ok) {
      throw new Error('No se pudo guardar el voto')
      
    }
    alert('Voto registrado')

    
  } catch (error) {
    console.log('ERROR REAL:', error)
    alert('Error al registrar voto')
    
  }
}
</script>



<template>
  <div class="detalle">
    <p v-if="isLoading">Cargando...</p>
    <div v-if="isError">
      <button @click="isError = false">Cerrar</button>
      <p>Error al cargar el detalle</p>
    </div>

    
    <div v-if="item" class="contenido">
      <img :src="item.poster" :alt="item.titulo" />
      <div class="info">
        <h1>{{ item.titulo }}</h1>
        <p>{{ item.año }} | {{ item.genero }}</p>
        <p>⭐ {{ item.puntuacion }}</p>
        <p class="descripcion">{{ item.descripcion }}</p>
      </div>
    </div>
    <div>  
      <P><button @click="agregarFavorito" class="boton">
      Agregar a favoritos ❤️  
    </button></P>
    
          <button @click="irAlCatalogo" class="boton">
    Ir al catálogo
  </button>

  <div class="rating">
  <p>Tu puntuación:</p>

  <vue3-star-ratings
  v-model="puntuacion"
  :numberOfStars="10"
/>
</div>
</div>
<p>Elegiste: {{ puntuacion }}/10</p>

<button class="boton" @click="votarPelicula">
  Votar película
</button>

  </div>
</template>

<style scoped>
.detalle {
  padding: 1rem;
}

.contenido {
  display: flex;
  gap: 1rem;
}

.contenido img {
  width: 300px;
  max-height: 450px;
  object-fit: cover;
  border-radius: 10px;
}

.info h1 {
  margin: 0;
}
.boton {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.descripcion {
  margin-top: 1rem;
}

.rating {
  margin-top: 1rem;
}

.rating p {
  margin: 0.5rem 0;
}

</style>