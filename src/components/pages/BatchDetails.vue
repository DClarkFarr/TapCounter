<script lang="ts" setup>
import BatchService from "@/services/BatchService";
import useAuthStore from "@/stores/useAuthStore";
import { Batch } from "@/types/BatchTypes";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import IconCircleNotch from "~icons/fa-solid/circle-notch";
import MobileLayout from "../Layout/MobileLayout.vue";
import IconArrowLeft from "~icons/fa-solid/arrow-left";
import { orderBy } from "lodash";

const route = useRoute();
const auth = useAuthStore();

const batchId = computed(() => route.params.batchId?.toString());
const isLoading = ref(true);
const batch = ref<Batch | null>(null);

const batchItems = computed(() => {
    if (!batch.value) {
        return [];
    }
    return orderBy(batch.value.items, ["name"], ["asc"]);
});

onMounted(() => {
    BatchService.getBatch(batchId.value)
        .then((b) => {
            batch.value = b;
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            isLoading.value = false;
        });
});
</script>

<template>
    <MobileLayout>
        <template #header>
            <Header>
                <template #iconLeft>
                    <RouterLink
                        to="/list"
                        class="btn btn-sm bg-gray-800 hover:bg-gray-900 flex gap-x-1"
                    >
                        <IconArrowLeft class="w-4" />
                        Back
                    </RouterLink>
                </template>
                <template #iconRight></template>

                <div>
                    <div class="font-semibold text-xl text-center">
                        {{ auth.selectedStore?.name || "Store Name" }}
                    </div>
                    <div class="font-light text-lg text-center opacity-[0.75]">
                        Load Details
                    </div>
                </div>
            </Header>
        </template>

        <div
            class="p-10 flex items-center h-50 justify-center"
            v-if="isLoading"
        >
            <IconCircleNotch class="animate-spin h-10 w-10" />
        </div>
        <div v-else-if="batch">
            <div class="details bg-slate-200 px-4 py-2 mb-4">
                <h2 class="text-xl font-semibold">
                    {{ batch.name }}
                </h2>
                <h4 class="text-lg">
                    Completed at
                    {{ batch?.completedAt?.toFormat("LLL dd, yyyy") }}
                </h4>
            </div>
            <div class="items">
                <div
                    class="item flex items-center bg-white border border-slate-500 px-4 py-2 mb-1"
                    v-for="(item, index) of batchItems"
                    :key="index"
                >
                    <div class="item__name flex-grow">xxxx-{{ item.name }}</div>
                    <div class="item__count text-center text-lg font-semibold">
                        {{ item.quantity }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="p-10">
            <div class="px-6 py-3 bg-red-700 text-white">
                Load details not found
            </div>
        </div>
    </MobileLayout>
</template>
