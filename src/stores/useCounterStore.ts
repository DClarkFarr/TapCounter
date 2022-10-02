import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { orderBy } from "lodash";

export type Item = {
    name: string;
    quantity: number;
};

export type Status = "active" | "inactive";

const useCounterStore = defineStore("counter", () => {
    let initialStatus: Status = "inactive";
    let initialItems: Item[] = [];
    let initialName = "";

    let storage = localStorage.getItem("counter");
    if (storage?.length) {
        const tempState: {
            name: string;
            items: Item[];
            status: Status;
        } = JSON.parse(storage);

        initialStatus = tempState.status;
        initialItems = tempState.items;
        initialName = tempState.name;
    }

    const status = ref<Status>(initialStatus);
    const name = ref(initialName);

    const view = ref<"app" | "confirmEnd">("app");

    const input = ref("");

    const items = ref<Item[]>(initialItems);

    const filteredItems = computed(() => {
        if (!input.value) {
            return items.value;
        }

        return items.value.filter((item) =>
            item.name.match(new RegExp(`^${input.value}`, "i"))
        );
    });

    const inputValid = computed(() => {
        return input.value.length >= 4;
    });

    const setInput = (value: string) => {
        input.value = value;
    };

    const startSession = (sessionName: string) => {
        view.value = "app";
        name.value = sessionName;
        status.value = "active";
    };

    const confirmEndSession = (status: boolean) => {
        view.value = status ? "confirmEnd" : "app";
    };

    const endSession = () => {
        status.value = "inactive";
        name.value = "";
    };

    const addItem = (data: { name: string; quantity: number }) => {
        input.value = "";
        items.value.push(data);
    };

    return {
        status,
        name,
        startSession,
        view,
        confirmEndSession,
        endSession,
        input,
        setInput,
        inputValid,
        addItem,
        items,
        filteredItems,
    };
});

export default useCounterStore;
