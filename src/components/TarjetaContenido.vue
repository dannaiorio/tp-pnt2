<script setup>
import { useRouter } from 'vue-router'
 
const router = useRouter()
 
const props = defineProps({
  item: Object,
  mostrarEliminar: { type: Boolean, default: false },
  posicion: { type: Number, default: null },
 
})
 
const emit = defineEmits(['eliminar', 'click'])
 
function handleClick() {
  if (props.usarModal) {
    emit('click', props.item)
  } else {
    router.push('/detalle/' + (props.item.peliculaId || props.item.id))
  }
}
</script>
 
<template>
  <div class="tarjeta" @click="handleClick">
    <div v-if="posicion" class="posicion">#{{ posicion }}</div>
 
    <div class="poster-wrapper">
      <img v-if="item.poster" :src="item.poster" :alt="item.titulo" class="poster" />
      <div v-else class="poster-placeholder">{{ item.titulo?.slice(0, 2) }}</div>
      <div class="overlay">
        <span class="play-icon">▶</span>
        <span class="ver-mas">Ver detalle</span>
      </div>
    </div>
 
    <div class="info">
      <h2 class="titulo">{{ item.titulo }}</h2>
      <div class="meta">
        <span class="puntuacion">⭐ {{ item.puntuacion }}</span>
        <span v-if="item.genero" class="genero">{{ item.genero }}</span>
      </div>
      <button
        v-if="mostrarEliminar"
        class="boton-eliminar"
        @click.stop="emit('eliminar', item.id)"
      >
        🗑 Eliminar
      </button>
    </div>
  </div>
</template>
 
<style scoped>
.tarjeta {
  background: var(--fondo-card);
  border-radius: 10px; overflow: hidden;
  cursor: pointer; width: 100%;
  border: 1px solid var(--borde);
  position: relative;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.tarjeta:hover {
  transform: translateY(-4px);
  border-color:  rgba(236, 61, 96, 0.4);
  box-shadow: 0 2px 10px rgba(241, 151, 255, 0.55);
}
 
.poster-wrapper { position: relative; overflow: hidden; }
 
.poster {
  width: 100%; height: 350px;
  object-fit: cover; display: block;
  transition: transform 0.3s;
}
.tarjeta:hover .poster { transform: scale(1.05); }
 
.poster-placeholder {
  width: 100%; height: 260px;
  background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 3rem; color: rgba(255,255,255,0.1);
}
 
.overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%);
  opacity: 0; transition: opacity 0.2s;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 0.5rem;
}
.tarjeta:hover .overlay { opacity: 1; }
 
.play-icon {
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.9); color: #111;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 16px; padding-left: 3px;
}
 
.ver-mas { font-size: 12px; color: rgba(255,255,255,0.8); }
 
.posicion {
  position: absolute; top: 10px; left: 10px; z-index: 2;
  background: var(--acento); color: white;
  font-family: 'Bebas Neue', sans-serif; font-size: 0.95rem;
  letter-spacing: 1px; padding: 2px 9px; border-radius: 5px;
}
 
.info { padding: 0.7rem 0.75rem 0.75rem; }
 
.titulo {
  font-size: 20px; font-weight: 500;
  font-family: 'DM Sans', sans-serif; letter-spacing: 0;
  color: var(--texto); white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
  margin-bottom: 0.35rem;
}
 
.meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
 
.puntuacion { font-size: 12px; color: var(--texto-suave); }
 
.genero {
  font-size: 11px; color: var(--acento);
  background: rgba(236,61,96,0.1);
  border: 1px solid rgba(236,61,96,0.2);
  padding: 2px 8px; border-radius: 20px;
}
 
.boton-eliminar {
  margin-top: 0.4rem; width: 100%; padding: 0.4rem;
  background: rgba(231,76,60,0.08);
  border: 1px solid rgba(231,76,60,0.25);
  color: #e74c3c; border-radius: 6px;
  cursor: pointer; font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.15s;
}
.boton-eliminar:hover { background: rgba(231,76,60,0.2); }
</style>