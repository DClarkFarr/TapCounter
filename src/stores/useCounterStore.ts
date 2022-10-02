import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { ref } from "vue";

const useCounterStore = defineStore("counter", () => {
    const status = ref<"active" | "inactive">("inactive");
    const name = ref("");
    const startedAt = ref<DateTime>();

    const view = ref<"app" | "confirmEnd">("app");

    const startSession = (sessionName: string) => {
        view.value = "app";
        name.value = sessionName;
        startedAt.value = DateTime.local();
        status.value = "active";
    };

    const confirmEndSession = (status: boolean) => {
        view.value = status ? "confirmEnd" : "app";
    };

    const endSession = () => {
        console.log("ending session");
        status.value = "inactive";
        name.value = "";
        startedAt.value = undefined;
    };

    return {
        status,
        name,
        startedAt,
        startSession,
        view,
        confirmEndSession,
        endSession,
    };
});

export default useCounterStore;
