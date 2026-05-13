<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'


const votos = ref([])
const isLoading = ref(false)
const isError = ref(false)
const router = useRouter()


const URL_VOTOS = 'https://6a03ce8d2afe8349b4b583b8.mockapi.io/votos'

const irAlCatalogo = () => {
  router.push('/catalogo')  // Navega al catálogo
}
onMounted(() => getVotos())

async function getVotos() { 
try {
isLoading.value = true
isError.value = false

const respuesta = await fetch(URL_VOTOS)
const datos = await respuesta.json()

votos.value = datos
} catch (error) {
isError.value = true
} finally {
isLoading.value = false
}
}

const ranking = computed(() => {
const acumulador = {}

votos.value.forEach((voto) => {
if (!acumulador[voto.peliculaId]) {
acumulador[voto.peliculaId] = {
peliculaId: voto.peliculaId,
titulo: voto.titulo,
poster: voto.poster,
suma: 0,
cantidad: 0
}
}

acumulador[voto.peliculaId].suma += Number(voto.puntuacion)
acumulador[voto.peliculaId].cantidad++
})

return Object.values(acumulador)
.map((peli) => ({
...peli,
promedio: peli.suma / peli.cantidad
}))
.sort((a, b) => b.promedio - a.promedio)
})
</script>

<template>
<div class="ranking">
    <h1>Ranking de películas</h1>

    <p v-if="isLoading">Cargando ranking...</p>

    <div v-if="isError">
<p>Error al cargar el ranking</p>
<button @click="getVotos">Reintentar</button>
    </div>

    <p v-if="!isLoading && !isError && ranking.length === 0">
Todavía no hay votos cargados.
    </p>

    <div v-if="!isLoading && !isError && ranking.length > 0" class="grilla">
<div v-for="peli in ranking" :key="peli.peliculaId" class="tarjeta">
        <img :src="peli.poster" :alt="peli.titulo" />
        <h2>{{ peli.titulo }}</h2>
        <p>⭐ Promedio: {{ peli.promedio.toFixed(1) }}/10</p>
        <p>Votos: {{ peli.cantidad }}</p>
</div>
    </div>
    <p><button @click="irAlCatalogo" class="boton">
        Ir al catálogo
    </button></p>
</div>
</template>

<style scoped>
.ranking {
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