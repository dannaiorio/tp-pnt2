<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
item: Object,
mostrarEliminar: {
    type: Boolean,
    default: false
}
})

const emit = defineEmits(['eliminar'])
</script>

<template>
<div class="tarjeta" @click="router.push('/detalle/' + item.id)">
    <img :src="item.poster" :alt="item.titulo" />
    <h2>{{ item.titulo }}</h2>
    <p>⭐ {{ item.puntuacion }}</p>
    <button v-if="mostrarEliminar" class="boton-eliminar" @click.stop="emit('eliminar', item.id)">
    🗑 Eliminar
    </button>
</div>
</template>

<style scoped>
.tarjeta {
background: #1a1a1a;
border-radius: 10px;
overflow: hidden;
cursor: pointer;
 width: 100%;
  display: block;
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
