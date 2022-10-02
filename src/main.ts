import { createApp } from "vue";
import "./assets/style.scss";
import App from "./App.vue";
import router from "./routes";
import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount("#app");

window.addEventListener("load", function () {
    setTimeout(function () {
        // This hides the address bar:
        console.log("attempting scroll");
        window.scrollTo(0, 1);
    }, 0);
});
