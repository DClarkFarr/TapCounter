import { debounce } from "lodash";
import { defineStore } from "pinia";
import { ref } from "vue";

const useAuthStore = defineStore("auth", () => {
    const token = ref("");
    const setToken = (newToken: string) => {
        token.value = newToken;
    };

    return {
        token,
        setToken,
    };
});

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

export default useAuthStore;
