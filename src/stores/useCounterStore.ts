import { defineStore } from "pinia";
import { ref } from "vue";

const useCounterStore = defineStore("counter", () => {
    const status = ref<"active" | "inactive">("inactive");

    return { status };
});

export default useCounterStore;
