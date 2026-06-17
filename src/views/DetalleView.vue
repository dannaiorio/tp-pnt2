<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import vue3StarRatings from "vue3-star-ratings";
import { useFavoritosStore } from "@/stores/useFavoritosStore";
import { useVotosStore } from "../stores/useVotosStore";
import confetti from 'canvas-confetti'
import { useCatalogoStore } from '@/stores/useCatalogoStore'
import { useAuthStore } from "@/stores/useAuthStore"; 

const favoritosStore = useFavoritosStore();
const URL_FAVORITOS = "https://6a03ce8d2afe8349b4b583b8.mockapi.io/favoritos";
const URL_VOTOS = "https://6a03ce8d2afe8349b4b583b8.mockapi.io/votos";
const store = useVotosStore();
const puntuacion = ref(0);
const route = useRoute();
const router = useRouter();
const item = ref(null);
const isLoading = ref(false);
const isError = ref(false);
const votado = ref(false);
const catalogoStore = useCatalogoStore();
const authStore = useAuthStore();

const esSerie = computed(() => 
  catalogoStore.series.some(s => s.id === item.value?.id)
)
 
onMounted(() => getDetalle());
 
async function getDetalle() {
  try {
    isLoading.value = true;
    isError.value = false;
    const respuesta = await fetch("https://www.mockachino.com/99371521-7de7-47/catalogos");
    const datos = await respuesta.json();
    const todo = [...datos.peliculas, ...datos.series];
    const id = parseInt(route.params.id);
    item.value = todo.find((el) => el.id === id);
    if (!item.value) router.push("/catalogo");
  } catch (error) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
}
 
async function agregarFavorito(item, event) {
  console.log('usuario logueado:', authStore.usuarioLogueado)
  const rect = event.currentTarget.getBoundingClientRect()
  const yaExiste = favoritosStore.favoritos.some(f => f.peliculaId === item.id)
  if (yaExiste) {
    alert('Ya está en favoritos')
    return
  }
  await fetch(URL_FAVORITOS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...item, peliculaId: item.id, usuarioId:authStore.usuarioLogueado.id })
  })
  await favoritosStore.fetchFavoritos()
  const corazon = confetti.shapeFromText({ text: '❤️', scalar: 2 })
  confetti({
    particleCount: 40,
    spread: 60,
    shapes: [corazon],
    scalar: 2,
    colors: ['#e24b4a', '#ff6b6b', '#ff8fab'],
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    }
  })
}
 
async function votarPelicula() {
  try {
    await fetch(URL_VOTOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        peliculaId: item.value.id,
        titulo: item.value.titulo,
        poster: item.value.poster,
        puntuacion: Number(puntuacion.value)
      })
    })
    await store.fetchVotos()
    votado.value = true
  } catch (error) {
    alert("Error al registrar voto")
  }
}
</script>
 
<template>
  <div class="detalle">
 
    <div v-if="isLoading" class="estado">
      <div class="spinner"></div>
      <p>Cargando...</p>
    </div>
 
    <div v-if="isError" class="error-banner">
      <p>⚠️ Error al cargar el detalle</p>
      <button @click="isError = false" class="boton">Cerrar</button>
    </div>
 
    <div v-if="item">
      <!-- Fondo difuminado con el poster -->
      <div class="hero-bg" :style="{ backgroundImage: `url(${item.poster})` }"></div>
 
      <div class="contenido">
        <!-- Poster -->
        <div class="poster-col">
          <img :src="item.poster" :alt="item.titulo" class="poster" />
        </div>
 
        <!-- Info -->
        <div class="info-col">
          <div class="badges">
            <span class="badge-genero">{{ item.genero }}</span>
            <span class="badge-año">{{ item.año }}</span>
          </div>
 
          <h1 class="titulo">{{ item.titulo }}</h1>
 
          <div class="puntuacion">
            <span class="estrella">⭐</span>
            <span class="puntaje">{{ item.puntuacion }}</span>
            <span class="puntaje-max">/10</span>
          </div>
 
          <p class="descripcion">{{ item.descripcion }}</p>
 
          <!-- Acciones -->
          <div class="acciones">
            <button @click="agregarFavorito(item, $event)" class="boton boton-favorito">
              ❤️ Agregar a favoritos
            </button>
            <router-link to="/catalogo" class="boton-secundario">← Volver</router-link>
          </div>
 
          <!-- Votación -->
          <div class="votacion">
            <p class="votacion-titulo">Tu puntuación</p>
            <vue3-star-ratings v-model="puntuacion" :numberOfStars="10" />
            <p class="elegiste" v-if="puntuacion > 0">Elegiste: <strong>{{ puntuacion }}/10</strong></p>
 
            <div v-if="votado" class="voto-ok">
              ✅ ¡Voto registrado! Gracias por tu opinión.
            </div>
 
           <button class="boton" @click="votarPelicula">
                 Votar {{ esSerie ? 'serie' : 'película' }}
          </button>
          </div>
        </div>
      </div>
    </div>
 
  </div>
</template>
 
<style scoped>
.detalle {
  position: relative;
  min-height: 100vh;
}
 
/* Fondo difuminado */
.hero-bg {
  position: fixed;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(60px) brightness(0.15);
  z-index: -1;
  transform: scale(1.1);
}
 
.contenido {
  display: flex;
  gap: 3rem;
  padding: 3rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
  align-items: flex-start;
}
 
/* Poster */
.poster-col {
  flex-shrink: 0;
}
 
.poster {
  width: 280px;
  border-radius: 14px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
  display: block;
}
 
/* Info */
.info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 0.5rem;
}
 
.badges {
  display: flex;
  gap: 0.5rem;
}
 
.badge-genero {
  font-size: 12px;
  color: var(--acento);
  background: rgba(236, 61, 96, 0.15);
  border: 1px solid rgba(236, 61, 96, 0.3);
  padding: 3px 12px;
  border-radius: 20px;
}
 
.badge-año {
  font-size: 12px;
  color: var(--texto-suave);
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--borde);
  padding: 3px 12px;
  border-radius: 20px;
}
 
.titulo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2rem, 4vw, 3.5rem);
  letter-spacing: 2px;
  line-height: 1;
  color: var(--texto);
}
 
.puntuacion {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
}
 
.estrella { font-size: 1.2rem; }
.puntaje { font-size: 2rem; font-weight: 700; color: var(--texto); }
.puntaje-max { font-size: 1rem; color: var(--texto-suave); }
 
.descripcion {
  color: var(--texto-suave);
  font-size: 15px;
  line-height: 1.7;
  max-width: 520px;
}
 
.acciones {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}
 
/* Votación */
.votacion {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--borde);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 420px;
}
 
.votacion-titulo {
  font-size: 13px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--texto-suave);
}
 
.elegiste {
  font-size: 14px;
  color: var(--texto-suave);
}
 
.elegiste strong {
  color: var(--texto);
}
 
.voto-ok {
  background: rgba(39, 174, 96, 0.15);
  border: 1px solid rgba(39, 174, 96, 0.3);
  color: #2ecc71;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 14px;
}
 
/* Estado de carga */
.estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 6rem;
  color: var(--texto-suave);
}
 
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--borde);
  border-top-color: var(--acento);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
 
@keyframes spin { to { transform: rotate(360deg); } }
 
.error-banner {
  margin: 2rem;
  padding: 1rem 1.25rem;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
 
/* Responsive */
@media (max-width: 700px) {
  .contenido {
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 1rem;
  }
 
  .poster {
    width: 200px;
  }
}
</style>
 