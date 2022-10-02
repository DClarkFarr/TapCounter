<script lang="ts" setup>
import useCounterStore from "@/stores/useCounterStore";
import MobileLayout from "./Layout/MobileLayout.vue";
import Header from "./Counter/Header.vue";
import ConfirmEnd from "./Counter/ConfirmEnd.vue";
import WelcomeBlock from "./Counter/WelcomeBlock.vue";

const counter = useCounterStore();
</script>

<template>
    <MobileLayout>
        <template #header>
            <Header />
        </template>

        <template v-if="counter.status === 'active'">
            <template v-if="counter.view === 'app'"></template>
            <ConfirmEnd v-else-if="counter.view === 'confirmEnd'" />
        </template>
        <WelcomeBlock v-else-if="counter.status === 'inactive'" />

        <template #footer>
            <div v-if="counter.status === 'active' && counter.view === 'app'">
                <h2>footer stuff</h2>
            </div>
        </template>
    </MobileLayout>
</template>
