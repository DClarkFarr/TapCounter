import { createApp } from "vue";
import "./assets/style.scss";
import App from "./App.vue";
import router from "./routes";
import { createPinia } from "pinia";
import { initClient } from "./services/apiClient";
import { initAuthStore } from "./stores/useAuthStore";
import { initSocket } from "./services/socketIo";

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount("#app");

initClient(router);
initAuthStore();
initSocket();

window.addEventListener("load", function () {
    setTimeout(function () {
        // This hides the address bar:
        console.log("attempting scroll");
        window.scrollTo(0, 1);
    }, 0);
});
