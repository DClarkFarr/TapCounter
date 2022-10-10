<script lang="ts" setup>
import { computed, ComputedRef, watch } from "vue";
import useCounterStore from "@/stores/useCounterStore";
import MobileLayout from "./Layout/MobileLayout.vue";
import ConfirmEnd from "./Counter/ConfirmEnd.vue";

import CounterItem from "./Counter/CounterItem.vue";
import AddItemForm from "./Counter/AddItemForm.vue";
import CounterHeader from "./Counter/CounterHeader.vue";
import useSocket from "@/hooks/useSocket";
import { useRouter } from "vue-router";

const props = defineProps<{
    batchId: string;
}>();

const counter = useCounterStore();
const socket = useSocket();
const router = useRouter();

watch(
    () => props.batchId,
    (newId) => {
        counter.loadById(newId);
    },
    { immediate: true }
);

const computedBatchId = computed(() => counter.batchId || "");

socket.onBatchEvent(computedBatchId, {
    onChange: (batch) => {
        counter.updateBatchFromSocket(batch);

        if (batch.completedAt) {
            router.push("/list");
        }
    },
});
</script>

<template>
    <MobileLayout>
        <template #header>
            <CounterHeader />
        </template>

        <template v-if="counter.view === 'app'">
            <div class="grid gap-1">
                <CounterItem
                    v-for="(item, index) in counter.filteredItems"
                    :item="item"
                    :key="`${item.name}-${index}`"
                    :selected="counter.filteredItemsLastAddedIndex === index"
                    :expand="counter.filteredItemsLongPressedIndex === index"
                />
            </div>
        </template>
        <ConfirmEnd v-else-if="counter.view === 'confirmEnd'" />

        <template #footer>
            <div v-if="counter.view === 'app'">
                <AddItemForm />
            </div>
        </template>
    </MobileLayout>
</template>

<style lang="scss" scoped>
.grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
</style>
