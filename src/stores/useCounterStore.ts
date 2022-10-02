import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
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
        initialItems = tempState.items.map((i) =>
            reactive({ ...i, quantity: Number(i.quantity) })
        );
        initialName = tempState.name;
    }

    const status = ref<Status>(initialStatus);
    const name = ref(initialName);

    const view = ref<"app" | "confirmEnd">("app");

    const input = ref("");

    const lastAddedIndex = ref(-1);

    const longPressedIndex = ref(-1);

    const items = ref<Item[]>(initialItems);

    const filteredItems = computed(() => {
        if (!input.value) {
            return items.value;
        }

        return items.value.filter((item) =>
            item.name.match(new RegExp(`^${input.value}`, "i"))
        );
    });

    const filteredItemsLastAddedIndex = computed(() => {
        if (lastAddedIndex.value === -1) {
            return -1;
        }
        const item = items.value[lastAddedIndex.value];
        return filteredItems.value.findIndex((i) => i.name === item.name);
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
        items.value = [];
        longPressedIndex.value = -1;
        lastAddedIndex.value = -1;
        localStorage.removeItem("counter");
    };

    const addItem = (data: { name: string; quantity: number }) => {
        const foundIndex = items.value.findIndex((i) => i.name === data.name);

        longPressedIndex.value = -1;
        input.value = "";

        if (foundIndex > -1) {
            items.value[foundIndex].quantity += data.quantity;
            items.value = [...items.value];
            lastAddedIndex.value = foundIndex;
            return;
        }

        items.value.push(data);

        sortItems();

        lastAddedIndex.value = items.value.findIndex(
            (i) => i.name === data.name
        );
    };

    let sortItems = () => {
        items.value = orderBy(items.value, ["name"], ["asc"]);
    };

    const updateItem = (name: string, data: { quantity: number }) => {
        const foundIndex = items.value.findIndex((i) => i.name === name);
        longPressedIndex.value = -1;
        if (foundIndex > -1) {
            items.value[foundIndex].quantity = data.quantity;
            items.value = [...items.value];
            lastAddedIndex.value = foundIndex;
        }
    };

    const setLongPressed = (name: string) => {
        const foundIndex = items.value.findIndex((i) => i.name === name);
        if (foundIndex > -1) {
            longPressedIndex.value = foundIndex;
        }
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
        lastAddedIndex,
        updateItem,
        longPressedIndex,
        setLongPressed,
        filteredItemsLastAddedIndex,
    };
});

export default useCounterStore;
