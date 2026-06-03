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
 
onMounted(async () => {
  try {
    isLoading.value = true
    await catalogoStore.fetchCatalogo()
    await favoritosStore.fetchFavoritos()
  } catch {
    isError.value = true
  } finally {
    isLoading.value = false
  }
})
 
const top5Peliculas = computed(() =>
  [...catalogoStore.peliculas].sort((a, b) => b.puntuacion - a.puntuacion).slice(0, 10)
)
const top5Series = computed(() =>
  [...catalogoStore.series].sort((a, b) => b.puntuacion - a.puntuacion).slice(0, 10)
)
 
const heroItem = computed(() => top5Peliculas.value[heroIndex.value] || null)
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
  <button class="hero-flecha" @click="heroIndex = (heroIndex - 1 + 3) % 3">‹</button>
  <div class="hero-dots">
    <button
      v-for="(_, i) in top5Peliculas.slice(0, 3)"
      :key="i"
      class="hero-dot-btn"
      :class="{ active: heroIndex === i }"
      @click="heroIndex = i"
    />
  </div>
  <button class="hero-flecha" @click="heroIndex = (heroIndex + 1) % 3">›</button>
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
 
.hero {
  position: relative; min-height: 520px;
  display: flex; align-items: flex-end; overflow: hidden;
  margin-top: calc(-1 * var(--navbar-h));
  padding-top: var(--navbar-h);
}
 
.hero-bg-img {
  position: absolute; inset: 0;
  background-size: cover; background-position: center top;
  filter: brightness(0.35); transform: scale(1.05);
}
 
.hero-gradient {
  position: absolute; inset: 0;
  background: linear-gradient(
    to right,
    rgba(13,13,13,0.97) 0%,
    rgba(13,13,13,0.75) 45%,
    rgba(13,13,13,0.2) 100%
  ), linear-gradient(to top, rgba(13,13,13,1) 0%, transparent 50%);
}
 
.hero-inner {
  position: relative; z-index: 2;
  padding: 3rem 2.5rem 3rem; max-width: 580px;
}
 
.hero-kicker {
  font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
  color: var(--acento); display: block; margin-bottom: 0.75rem;
}
 
.hero-titulo {
font-size: clamp(2.5rem, 5vw, 4rem);
line-height: 1;
margin-bottom: 0.75rem;
background: linear-gradient(135deg, #ffffff 0%, #ec3dc9 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;;
  letter-spacing: 2px; line-height: 0.95; margin-bottom: 1rem;
}
 
.hero-meta {
  display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;
  font-size: 13px; color: var(--texto-suave); margin-bottom: 1rem;
}
.hero-dot { opacity: 0.4; }
 
.hero-synopsis {
  font-size: 14px; color: rgba(240,230,246,0.7);
  line-height: 1.65; margin-bottom: 1.5rem; max-width: 440px;
}
 
.hero-acciones { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
 
.hero-dots { display: flex; gap: 0.5rem; }
.hero-dot-btn {
  width: 28px; height: 3px; border-radius: 2px;
  background: rgba(255,255,255,0.2); border: none; cursor: pointer;
  transition: background 0.2s, width 0.2s; padding: 0;
}
.hero-dot-btn.active { background: var(--acento); width: 40px; }
 
.filas { padding: 1rem 2rem 3rem; }
 
.estado {
  display: flex; flex-direction: column; align-items: center;
  gap: 1rem; padding: 6rem; color: var(--texto-suave);
}


.hero-navegacion {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hero-flecha {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  width: 36px; height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 22px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
  line-height: 1;
}

.hero-flecha:hover {
  background: rgba(236, 61, 96, 0.4);
  border-color: var(--acento);
}
</style>