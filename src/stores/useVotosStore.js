import { defineStore } from "pinia";
import { ref, computed } from "vue";

const URL_VOTOS = 'https://6a03ce8d2afe8349b4b583b8.mockapi.io/votos'

export const useVotosStore = defineStore("votos", () => {

const votos = ref([]);

async function fetchVotos() {
    const respuesta = await fetch(URL_VOTOS);
    votos.value = await respuesta.json();
}



const ranking = computed(() => {
    const acumulador = {};
    votos.value.forEach((voto) => {
    if (!acumulador[voto.peliculaId]) {
        acumulador[voto.peliculaId] = {
        peliculaId: voto.peliculaId,
        titulo: voto.titulo,
        poster: voto.poster,
        suma: 0,
        cantidad: 0,
        };
    }
    acumulador[voto.peliculaId].suma += Number(voto.puntuacion);
    acumulador[voto.peliculaId].cantidad++;
    });
    return Object.values(acumulador)
    .map((peli) => ({ ...peli, promedio: peli.suma / peli.cantidad }))
    .sort((a, b) => b.promedio - a.promedio);
});

return { votos, fetchVotos, ranking };
});
