<script lang="ts" setup>
import { watch } from "vue";
import useCounterStore from "@/stores/useCounterStore";
import MobileLayout from "./Layout/MobileLayout.vue";
import ConfirmEnd from "./Counter/ConfirmEnd.vue";

import CounterItem from "./Counter/CounterItem.vue";
import AddItemForm from "./Counter/AddItemForm.vue";
import CounterHeader from "./Counter/CounterHeader.vue";

const props = defineProps<{
    batchId: string;
}>();

const counter = useCounterStore();

watch(
    () => props.batchId,
    (batchId) => {
        counter.loadById(batchId);
    },
    { immediate: true }
);
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
                    :expand="counter.longPressedIndex === index"
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
