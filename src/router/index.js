import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import CatalogoView from '../views/CatalogoView.vue'
import DetalleView from '../views/DetalleView.vue'
import FavoritosView from '../views/FavoritosView.vue'

const router = createRouter({
history: createWebHistory(),

routes: [
    { path: '/', redirect: '/catalogo' }, // Redirige la raíz al catálogo por el momento hasta decidir HomeView
    { path: '/catalogo', component: CatalogoView },
    { path: '/detalle/:id', component: DetalleView },
    { path: '/favoritos', component: FavoritosView }
]
})

export default router