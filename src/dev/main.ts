import { createApp } from "vue";
import App from "./App.vue";
import Vuepoint from "../index";

const app = createApp(App);

app.use(Vuepoint, {
  enabled: true,
  autoMount: true,
  storageKey: "__vuepoint_demo__",
});

app.mount("#app");
