<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCatalogoStore } from '@/stores/useCatalogoStore'
import { useFavoritosStore } from '@/stores/useFavoritosStore'
import { useRouter } from 'vue-router'
import RowScroll from '@/components/RowScroll.vue'

const catalogoStore = useCatalogoStore()
const favoritosStore = useFavoritosStore()
const router = useRouter()
const isLoading = ref(false)
const isError = ref(false)
const heroIndex = ref(0)

const URL_DESTACADAS = 'https://6a31d6a07bc5e1c612663f52.mockapi.io/destacadas'
const destacadasIds = ref([])

onMounted(async () => {
  try {
    isLoading.value = true
    const [_, __, destacadasRes] = await Promise.all([
      catalogoStore.fetchCatalogo(),
      favoritosStore.fetchFavoritos(),
      fetch(URL_DESTACADAS)
    ])
    const destacadasData = await destacadasRes.json()
    destacadasIds.value = destacadasData.map(d => Number(d.peliculaId))
  } catch {
    isError.value = true
  } finally {
    isLoading.value = false
  }
})

// Las 3 películas destacadas elegidas por el admin
const heroItems = computed(() => {
  if (!destacadasIds.value.length) return []
  return destacadasIds.value
    .map(id => catalogoStore.contenido.find(p => p.id === id))
    .filter(Boolean)
})

const heroItem = computed(() => heroItems.value[heroIndex.value] || null)

const top5Peliculas = computed(() =>
  [...catalogoStore.peliculas].sort((a, b) => b.puntuacion - a.puntuacion).slice(0, 10)
)
const top5Series = computed(() =>
  [...catalogoStore.series].sort((a, b) => b.puntuacion - a.puntuacion).slice(0, 10)
)
</script>

<template>
  <div class="home">

    <div v-if="isLoading" class="estado">
      <div class="spinner"></div>
      <p>Cargando...</p>
    </div>

    <div v-if="isError" class="error-banner" style="margin: 2rem">
      <p>⚠️ Error al cargar el contenido</p>
      <button @click="isError = false" class="boton">Cerrar</button>
    </div>

    <!-- HERO -->
    <section v-if="!isLoading && heroItem" class="hero">
      <div
        v-if="heroItem.poster"
        class="hero-bg-img"
        :style="{ backgroundImage: `url(${heroItem.poster})` }"
      ></div>
      <div class="hero-gradient"></div>

      <div class="hero-inner">
        <span class="hero-kicker">Destacada de hoy</span>
        <h1 class="hero-titulo">{{ heroItem.titulo }}</h1>
        <div class="hero-meta">
          <span class="rating-chip">⭐ {{ heroItem.puntuacion }}</span>
          <span>{{ heroItem.año }}</span>
          <span class="hero-dot">•</span>
          <span>{{ heroItem.genero }}</span>
        </div>
        <p class="hero-synopsis">{{ heroItem.descripcion }}</p>
        <div class="hero-acciones">
          <button class="boton" @click="router.push('/detalle/' + heroItem.id)">▶ Ver detalle</button>
          <button class="boton-ghost" @click="router.push('/catalogo')">Explorar catálogo</button>
        </div>
        <div class="hero-navegacion">
          <button class="hero-flecha" @click="heroIndex = (heroIndex - 1 + heroItems.length) % heroItems.length">‹</button>
          <div class="hero-dots">
            <button
              v-for="(_, i) in heroItems"
              :key="i"
              class="hero-dot-btn"
              :class="{ active: heroIndex === i }"
              @click="heroIndex = i"
            />
          </div>
          <button class="hero-flecha" @click="heroIndex = (heroIndex + 1) % heroItems.length">›</button>
        </div>
      </div>
    </section>

    <!-- FILAS -->
    <div v-if="!isLoading" class="filas">
      <RowScroll titulo="🎬 Top Películas" :items="top5Peliculas" />
      <RowScroll titulo="📺 Top Series" :items="top5Series" />
    </div>

  </div>
</template>

<style scoped>
.home { min-height: 100vh; }

.estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 6rem;
  color: var(--texto-suave);
}

/* Hero */
.hero {
  position: relative;
  height: 20vh;
  min-height: 520px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.hero-bg-img {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center top;
  transform: scale(1.04);
  transition: background-image 0.5s ease;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    var(--fondo) 0%,
    rgba(13,13,13,0.85) 100%,
    rgba(13,13,13,0.6) 100%
  );
}

.hero-inner {
  position: relative;
  z-index: 2;
  padding: 3rem 3.5rem;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.hero-kicker {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--acento);
  font-weight: 600;
}

.hero-titulo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3rem, 7vw, 5.5rem);
  letter-spacing: 3px;
  line-height: 0.95;
  background: linear-gradient(135deg, #d42e94, #f5beff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 14px;
  color: var(--texto-suave);
}

.hero-dot { opacity: 0.4; }

.hero-synopsis {
  font-size: 15px;
  color: rgba(240,230,246,0.7);
  line-height: 1.65;
  max-width: 480px;
}

.hero-acciones {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.hero-navegacion {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.hero-flecha {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.hero-flecha:hover { background: rgba(255,255,255,0.2); }

.hero-dots { display: flex; gap: 6px; }

.hero-dot-btn {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.25);
  cursor: pointer;
  padding: 0;
  transition: background 0.2s, transform 0.2s;
}
.hero-dot-btn.active {
  background: var(--acento);
  transform: scale(1.3);
}

/* Filas */
.filas {
  padding: 2rem 0 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
</style>