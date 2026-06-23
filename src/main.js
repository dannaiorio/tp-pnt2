import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";

const pinia = createPinia();
createApp(App).use(router).use(pinia).use(PrimeVue).mount("#app");
