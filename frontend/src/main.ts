import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "simple-notify/dist/simple-notify.css";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import router from "./router";
import { createPinia } from "pinia";

const pinia = createPinia();

createApp(App)
  .use(Vue3Toastify, {
    autoClose: 3000,
    // ...
  } as ToastContainerOptions)
  .use(router)
  .use(pinia)
  .mount("#app");
