import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import ui from "@nuxt/ui/vue-plugin";
import { createMemoryHistory, createRouter } from "vue-router";
import HomeView from "./components/ HomeView.vue";

const routes = [{ path: "/", component: HomeView }];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

const app = createApp(App);

app.use(createPinia());
app.use(ui);
app.use(router);
app.mount("#app");
