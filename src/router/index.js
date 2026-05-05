import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CatalogoView from '../views/CatalogoView.vue'
import DetalleView from '../views/DetalleView.vue'
import FavoritosView from '../views/FavoritosView.vue'

const router = createRouter({
history: createWebHistory(),
routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/catalogo', name: 'catalogo', component: CatalogoView },
    { path: '/detalle/:id', name: 'detalle', component: DetalleView },
    { path: '/favoritos', name: 'favoritos', component: FavoritosView }
]
})

export default router