import useAuthStore from "@/stores/useAuthStore";
import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    withCredentials: true,
});

export const initClient = () => {
    const authStore = useAuthStore();

    apiClient.interceptors.request.use((config) => {
        console.log("auth store token", authStore.token);
        const token = authStore.token;
        if (!config.headers) {
            config.headers = {};
        }
        config.headers.Authorization = `Bearer ${token}`;

        return config;
    });

    apiClient.interceptors.response.use((response) => {
        if (response.headers["x-token"]) {
            authStore.setToken(response.headers["x-token"]);
        }

        return response;
    });

    authStore.ready();
};
export default apiClient;
