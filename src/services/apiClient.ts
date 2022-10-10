import useAuthStore from "@/stores/useAuthStore";
import axios from "axios";
import { Router } from "vue-router";

console.log("got api endpoint", import.meta.env.VITE_API_ENDPOINT);

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    withCredentials: true,
});

export const initClient = (router: Router) => {
    const authStore = useAuthStore();

    apiClient.interceptors.request.use((config) => {
        const token = authStore.token;
        if (!config.headers) {
            config.headers = {};
        }
        config.headers.Authorization = `Bearer ${token}`;

        return config;
    });

    apiClient.interceptors.response.use(
        (response) => {
            if (response.headers["x-token"]) {
                authStore.setToken(response.headers["x-token"]);
            }

            return response;
        },
        (err) => {
            if (err.response.status === 401) {
                authStore.logout();
                router.push("/");
            }

            throw err;
        }
    );

    authStore.ready();
};
export default apiClient;
