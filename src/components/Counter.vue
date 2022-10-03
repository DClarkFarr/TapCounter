<script lang="ts" setup>
import useCounterStore from "@/stores/useCounterStore";
import MobileLayout from "./Layout/MobileLayout.vue";
import Header from "./Counter/Header.vue";
import ConfirmEnd from "./Counter/ConfirmEnd.vue";
import WelcomeBlock from "./Counter/WelcomeBlock.vue";

import { debounce } from "lodash";
import CounterItem from "./Counter/CounterItem.vue";
import AddItemForm from "./Counter/AddItemForm.vue";

const counter = useCounterStore();
</script>

<template>
    <MobileLayout>
        <template #header>
            <Header />
        </template>

        <template v-if="counter.status === 'active'">
            <template v-if="counter.view === 'app'">
                <div class="grid gap-1">
                    <CounterItem
                        v-for="(item, index) in counter.filteredItems"
                        :item="item"
                        :key="`${item.name}-${index}`"
                        :selected="
                            counter.filteredItemsLastAddedIndex === index
                        "
                        :expand="counter.longPressedIndex === index"
                    />
                </div>
            </template>
            <ConfirmEnd v-else-if="counter.view === 'confirmEnd'" />
        </template>
        <WelcomeBlock v-else-if="counter.status === 'inactive'" />

        <template #footer>
            <div v-if="counter.status === 'active' && counter.view === 'app'">
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
