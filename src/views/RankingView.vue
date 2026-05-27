<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useVotosStore } from "../stores/useVotosStore";
import { useFiltrar } from "@/composables/useFiltrar";
import TarjetaContenido from '@/components/TarjetaContenido.vue';

const store = useVotosStore();
const router = useRouter();
const { filtrar } = useFiltrar();

const isLoading = ref(false);
const isError = ref(false);


const busqueda = ref('');

const irAlCatalogo = () => {
router.push("/catalogo"); 
};

onMounted(() => cargar());

async function cargar() {
try {
    isLoading.value = true;
    isError.value = false;
    await store.fetchVotos();
} catch (error) {
    isError.value = true;
} finally {
    isLoading.value = false;
}
}

const rankingFiltrado = computed(() =>
filtrar(store.ranking, { busqueda: busqueda.value, generoSeleccionado: '', añoSeleccionado: '' })
)
</script>

<template>
<div class="ranking">
    <h1>Ranking de películas</h1>

    <!-- Búsqueda -->
    <input type="text" v-model="busqueda" placeholder="Buscar por título..." />
    <button @click="busqueda = ''" class="boton">Limpiar</button>

    <p v-if="isLoading">Cargando ranking...</p>

    <div v-if="isError">
        <p>Error al cargar el ranking</p>
        <button @click="cargar">Reintentar</button>
    </div>

    <p v-if="!isLoading && !isError && rankingFiltrado.length === 0">
    Todavía no hay votos cargados.
    </p>

<div v-if="!isLoading && !isError && rankingFiltrado.length > 0" class="grilla">
<TarjetaContenido
    v-for="item in rankingFiltrado"
    :key="item.peliculaId"
    :item="item"
/>
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


</style>
