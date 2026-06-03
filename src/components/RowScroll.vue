<script setup>
import { ref } from 'vue'
import TarjetaContenido from '@/components/TarjetaContenido.vue'
 
defineProps({
  titulo: String,
  items: Array,
})
 
const scroller = ref(null)
 
function scroll(dir) {
  if (scroller.value)
    scroller.value.scrollBy({ left: dir * (scroller.value.clientWidth * 0.75), behavior: 'smooth' })
}
</script>
 
<template>
  <section class="row-seccion">
    <div class="row-header">
      <h2 class="row-titulo">{{ titulo }}</h2>
      <div class="row-nav">
        <button @click="scroll(-1)" class="row-btn">‹</button>
        <button @click="scroll(1)" class="row-btn">›</button>
      </div>
    </div>
 
    <div class="row-scroller" ref="scroller">
      <div class="row-item" v-for="(item, i) in items" :key="item.id">
        <TarjetaContenido :item="item" :posicion="i + 1" />
      </div>
    </div>
  </section>
</template>
 
<style scoped>
.row-seccion { margin-bottom: 2.5rem; }
 
.row-header {
  display: flex; justify-content: space-between;
  align-items: center; margin-bottom: 1rem;
}
.row-titulo { font-size: 1.3rem; letter-spacing: 1px; }
.row-nav { display: flex; gap: 0.4rem; }
.row-btn {
  background: var(--fondo-card); border: 1px solid var(--borde);
  color: var(--texto-suave); width: 32px; height: 32px;
  border-radius: 50%; cursor: pointer; font-size: 20px;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.15s, background 0.15s; line-height: 1;
}
.row-btn:hover { color: var(--texto); background: var(--fondo-card-hover); }
 
.row-scroller {
  display: flex; gap: 0.85rem;
  overflow-x: auto; padding-bottom: 0.75rem;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none; scrollbar-width: none;
}
.row-scroller::-webkit-scrollbar { display: none; }
 
.row-item {
  flex-shrink: 0; width: 250px; scroll-snap-align: start;
}
</style>