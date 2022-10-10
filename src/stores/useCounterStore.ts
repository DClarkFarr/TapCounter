import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { orderBy } from "lodash";
import BatchService from "@/services/BatchService";
import { Batch } from "@/types/BatchTypes";

export type Item = {
    name: string;
    quantity: number;
};

export type Status = "active" | "inactive";

const useCounterStore = defineStore("counter", () => {
    const batchId = ref<string>();
    const createdAt = ref<DateTime>();
    const completedAt = ref<DateTime | null>(null);
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

    const filteredItemsLongPressedIndex = computed(() => {
        if (longPressedIndex.value === -1) {
            return -1;
        }
        const item = items.value[longPressedIndex.value];
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
        return BatchService.completeBatch(batchId.value as string).then(
            (res) => {
                batchId.value = undefined;
                completedAt.value = null;
                createdAt.value = undefined;
                view.value = "app";
                name.value = "";
                items.value = [];
                longPressedIndex.value = -1;
                lastAddedIndex.value = -1;
                return res;
            }
        );
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

        BatchService.getBatch(id)
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
        BatchService.saveItems(batchId.value as string, items.value);
    };

    const updateBatchFromSocket = (b: Batch) => {
        completedAt.value = b.completedAt;
        items.value = b.items;
        name.value = b.name;
        lastAddedIndex.value = -1;
        longPressedIndex.value = -1;

        sortItems();
    };

    return {
        batchId,
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
        lastAddedIndex,
        longPressedIndex,
        filteredItems,
        filteredItemsLastAddedIndex,
        filteredItemsLongPressedIndex,
        updateItem,
        setLongPressed,
        loadById,
        updateBatchFromSocket,
    };
});

export default useCounterStore;
