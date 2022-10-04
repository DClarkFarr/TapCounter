<script lang="ts" setup>
import MobileLayout from "../Layout/MobileLayout.vue";
import useAuthStore from "@/stores/useAuthStore";
import useBatches from "@/hooks/useBatches";
import IconCircleNotch from "~icons/fa-solid/circle-notch";
import CreateForm from "../Counter/CreateForm.vue";

const auth = useAuthStore();

const { isLoading, batches, createBatch } = useBatches();

const onCreate = (data: { name: string }, resolve: () => void) => {
    createBatch(data).finally(() => {
        resolve();
    });
};
</script>

<template>
    <MobileLayout>
        <template #header>
            <Header>
                <template #iconLeft></template>
                <template #iconRight></template>

                <div>
                    <div class="font-semibold text-xl text-center">
                        {{ auth.selectedStore?.name || "Store Name" }}
                    </div>
                    <div class="font-light text-lg text-center opacity-[0.75]">
                        Tap Counter
                    </div>
                </div>
            </Header>
        </template>
        <div class="flex justify-center items-center h-full" v-if="isLoading">
            <IconCircleNotch class="animate-spin" />
        </div>
        <div class="store-list" v-else-if="batches.length">
            <div v-for="b in batches" :key="b.id" class="store-list-item">
                <div class="flex items-center">
                    <div class="flex items-center">
                        <div class="store-list-item__name">
                            <div class="font-semibold text-lg">
                                {{ b.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-center items-center h-full" v-else>
            <div class="text-center">
                <div class="font-semibold text-2xl">No batches found</div>
                <div class="font-light text-lg mb-4">
                    Create one to get started
                </div>
                <div>
                    <div class="rounded-lg p-8 bg-white/50">
                        <CreateForm @create="onCreate" />
                    </div>
                </div>
            </div>
        </div>
    </MobileLayout>
</template>
