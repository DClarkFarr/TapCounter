import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { orderBy } from "lodash";
import apiClient from "@/services/apiClient";
import { Batch } from "@/types/BatchTypes";

export type Item = {
    name: string;
    quantity: number;
};

export type Status = "active" | "inactive";

const useCounterStore = defineStore("counter", () => {
    const batchId = ref<string>();
    const completedAt = ref<DateTime | null>(null);
    const createdAt = ref<DateTime>();
    const items = ref<Item[]>([]);
    const name = ref("");

    const view = ref<"app" | "confirmEnd">("app");

    const input = ref("");

    const lastAddedIndex = ref(-1);

    const longPressedIndex = ref(-1);

    const isLoading = ref(false);

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

    const confirmEndSession = (status: boolean) => {
        view.value = status ? "confirmEnd" : "app";
    };

    const endSession = () => {
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

        saveItems();
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
        saveItems();
    };

    const setLongPressed = (name: string) => {
        const foundIndex = items.value.findIndex((i) => i.name === name);
        if (foundIndex > -1) {
            longPressedIndex.value = foundIndex;
        }
    };

    const loadById = (id: string) => {
        batchId.value = id;
        isLoading.value = true;

        apiClient
            .get<{ batch: Batch<string> }>(`/store/batch/${id}`)
            .then(({ data }) => ({
                ...data.batch,
                createdAt: DateTime.fromISO(data.batch.createdAt),
                completedAt: data.batch.completedAt
                    ? DateTime.fromISO(data.batch.completedAt)
                    : null,
            }))
            .then((batch) => {
                name.value = batch.name;
                createdAt.value = batch.createdAt;
                completedAt.value = batch.completedAt;
                items.value = batch.items;
                sortItems();
            })
            .finally(() => {
                isLoading.value = false;
            });
    };

    const saveItems = () => {
        apiClient.put(`/store/batch/${batchId.value}`, {
            items: items.value,
        });
    };

    return {
        completedAt,
        createdAt,
        isLoading,
        name,
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
        loadById,
    };
});

export default useCounterStore;
