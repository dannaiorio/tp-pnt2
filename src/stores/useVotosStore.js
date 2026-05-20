import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useVotosStore = defineStore("votos", () => {
    const votos = ref([]);
    const isLoading = ref(false);
    const isError = ref(false);

async function fetchVotos() {
    try {
        isLoading.value = true;
        isError.value = false;
        const respuesta = await fetch(
        "https://6a03ce8d2afe8349b4b583b8.mockapi.io/votos",
    );
    votos.value = await respuesta.json();
    } catch (error) {
    isError.value = true;
    } finally {
    isLoading.value = false;
    }
}

async function agregarVoto(votoNuevo) {
await fetch("https://6a03ce8d2afe8349b4b583b8.mockapi.io/votos", {
    
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(votoNuevo),
    });
    await fetchVotos();
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

    return { votos, isLoading, isError, fetchVotos, agregarVoto, ranking };
});
