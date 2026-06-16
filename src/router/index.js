import { createRouter, createWebHistory } from "vue-router";
// import HomeView from '../views/HomeView.vue'
import CatalogoView from "../views/CatalogoView.vue";
import DetalleView from "../views/DetalleView.vue";
import FavoritosView from "../views/FavoritosView.vue";
import RankingView from "../views/RankingView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import AdminView from "../views/AdminView.vue";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    { path: "/", component: HomeView }, 
    { path: "/home", component: HomeView }, 
    { path: "/catalogo", component: CatalogoView },
    { path: "/detalle/:id", component: DetalleView }, // :id ruta dinamica
    { path: "/favoritos", component: FavoritosView },
    { path: "/ranking", component: RankingView },
       { path: "/login", component: LoginView },
       { path: "/admin",
      component: AdminView,
      meta: { soloAdmin: true }, },
  ],
});

// Guard de navegación — se importa el store acá adentro para que Pinia ya esté montado
router.beforeEach(async (to) => {
  if (to.meta.soloAdmin) {
    const { useAuthStore } = await import("../stores/useAuthStore.js");
    const { getActivePinia } = await import("pinia");
    const pinia = getActivePinia();
    if (!pinia) return "/login";
    const authStore = useAuthStore(pinia);
    if (!authStore.esAdmin) return "/login";
  }
});

export default router;
