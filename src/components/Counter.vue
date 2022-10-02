<script lang="ts" setup>
import useCounterStore from "@/stores/useCounterStore";
import MobileLayout from "./Layout/MobileLayout.vue";

const counter = useCounterStore();
</script>

<template>
    <MobileLayout>
        <template #header>
            <div class="flex w-full justify-bewtween">
                <div class="shrink w-10"></div>
                <div class="grow">
                    <h1 class="font-semibold text-xl text-center">
                        Tap Counter
                    </h1>
                </div>
                <div class="shrink w-10"></div>
            </div>
        </template>

        <template v-if="counter.status === 'active'"></template>
        <template v-else-if="counter.status === 'inactive'">
            <div
                class="h-full flex flex-col justify-center items-center text-center"
            >
                <div class="pb-[100px]">
                    <h1 class="font-bold text-3xl mb-4">
                        Welcome to Load Counter
                    </h1>
                    <p class="text-lg">Create a session to begin counting</p>
                </div>
            </div>
        </template>
    </MobileLayout>
</template>
