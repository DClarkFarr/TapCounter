import { debounce } from "lodash";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { StoreItem } from "@/types/StoreTypes";
import apiClient from "@/services/apiClient";

export interface AuthPayload extends JwtPayload {
    selectedStore: string;
}

const useAuthStore = defineStore("auth", () => {
    const isReady = ref(false);

    const storageToken = localStorage.getItem("token") || "";

    const { token: initialToken = "" } = storageToken.length
        ? JSON.parse(storageToken)
        : {
              token: "",
          };

    const token = ref(initialToken);
    const setToken = (newToken: string) => {
        token.value = newToken;
    };

    const selectedStore = ref<StoreItem | null>();

    const payload = computed(() => {
        let sStore = "";

        if (token.value) {
            const decoded = jwtDecode<AuthPayload>(token.value);
            if (decoded) {
                sStore = decoded?.selectedStore;
            }
        }

        return { selectedStore: sStore };
    });

    const loadSelectedStore = () => {
        return apiClient
            .get<{ store: StoreItem }>("/auth")
            .then(({ data: { store } }) => {
                selectedStore.value = store;
                return store;
            });
    };

    const ready = () => {
        isReady.value = true;

        if (payload.value.selectedStore) {
            loadSelectedStore();
        }
    };

    const logout = () => {
        setToken("");
    };

    watch(payload, () => {
        console.log("watching payload");
        if (
            payload.value.selectedStore &&
            selectedStore.value?.id !== payload.value.selectedStore
        ) {
            loadSelectedStore();
        } else if (!payload.value.selectedStore) {
            selectedStore.value = null;
        }
    });

    return {
        token,
        setToken,
        payload,
        ready,
        logout,
        selectedStore,
        loadSelectedStore,
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
