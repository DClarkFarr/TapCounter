import { debounce } from "lodash";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import jwtDecode, { JwtPayload } from "jwt-decode";

export interface AuthPayload extends JwtPayload {
    selectedStore: string;
}

const useAuthStore = defineStore("auth", () => {
    const initialToken = localStorage.getItem("token") || "";

    const token = ref(initialToken);
    const setToken = (newToken: string) => {
        token.value = newToken;
    };

    const payload = computed(() => {
        let selectedStore = "";
        if (token.value) {
            const decoded = jwtDecode<AuthPayload>(token.value);
            if (decoded) {
                selectedStore = decoded?.selectedStore;
            }
        }

        return { selectedStore };
    });

    return {
        token,
        setToken,
        payload,
    };
});

export const initAuthStore = () => {
    const globalStore = useAuthStore();

    const debounceSaveState = debounce(({ token }: typeof globalStore) => {
        const toSave = {
            token,
        };

        localStorage.setItem("token", JSON.stringify(toSave));
    }, 300);

    globalStore.$subscribe((mutation, state) => {
        debounceSaveState(state as typeof globalStore);
    });
};

export default useAuthStore;
