<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useVotosStore } from "../stores/useVotosStore";
const store = useVotosStore();

const router = useRouter();



const irAlCatalogo = () => {
  router.push("/catalogo"); // Navega al catálogo
};


onMounted(() => store.fetchVotos());


</script>

<template>
<div class="ranking">
    <h1>Ranking de películas</h1>

    <p v-if="store.isLoading">Cargando ranking...</p>

    <div v-if="store.isError">
<p>Error al cargar el ranking</p>
    <button @click="store.fetchVotos">Reintentar</button>
    </div>

    <p v-if="!store.isLoading && !store.isError && store.ranking.length === 0">
Todavía no hay votos cargados.
    </p>

<div v-if="!store.isLoading && !store.isError && store.ranking.length > 0" class="grilla">

<div v-for="peli in store.ranking" :key="peli.peliculaId" class="tarjeta">

        <img :src="peli.poster" :alt="peli.titulo" />

        <h2>{{ peli.titulo }}</h2>
        <p>⭐ Promedio: {{ peli.promedio.toFixed(1) }}/10</p>
        <p>Votos: {{ peli.cantidad }}</p>

    </div>
    </div>
    <p><button @click="irAlCatalogo" class="boton">Ir al catálogo</button></p>
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
