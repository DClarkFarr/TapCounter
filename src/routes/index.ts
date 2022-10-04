import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/pages/Home.vue";
import Counter from "@/components/pages/Counter.vue";
import List from "@/components/pages/List.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/list", component: List },
    { path: "/counter/:batchId", component: Counter },
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes, // short for `routes: routes`
});

export default router;
