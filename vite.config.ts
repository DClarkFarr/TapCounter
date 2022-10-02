import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": "/src",
        },
    },
    plugins: [
        vue(),
        Components({
            /* options */
            dirs: ["src/components"],
            extensions: ["vue"],
            deep: true,
        }),
        Icons(
            /* options */
            { compiler: "vue3" }
        ),
    ],
});
