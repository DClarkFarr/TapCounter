<script lang="ts" setup>
import MobileLayout from "../Layout/MobileLayout.vue";
import useAuthStore from "@/stores/useAuthStore";
import useBatches from "@/hooks/useBatches";
import IconCircleNotch from "~icons/fa-solid/circle-notch";
import CreateForm from "../Counter/CreateForm.vue";
import IconEye from "~icons/fa-solid/eye";
import IconPencil from "~icons/fa-solid/pencil-alt";

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
            <div
                v-for="b in batches"
                :key="b.id"
                class="item border-2 border-sky-800 bg-white rounded-md px-4 py-2 mb-2"
            >
                <div class="flex gap-x-4 items-center">
                    <div class="item__name grow lg:w-1/3">
                        <div class="text-sm font-thin">Batch Name:</div>
                        <div class="font-semibold">
                            {{ b.name }}
                        </div>
                    </div>
                    <div class="item__count text-center shrink">
                        <div class="text-sm font-thin">Items #</div>
                        <div class="font-semibold">
                            {{ b.items.length }}
                        </div>
                    </div>
                    <div class="item__status min-w-[130px] text-center">
                        <div v-if="b.completedAt">
                            <div class="text-sm font-thin">Completed</div>
                            <div class="font-semibold">
                                {{ b.completedAt.toFormat("LLL dd, yyyy") }}
                            </div>
                        </div>
                        <div v-else>
                            <div class="font-bold text-emerald-700 text-center">
                                Active
                            </div>
                        </div>
                    </div>
                    <div class="item__actions">
                        <template v-if="b.completedAt">
                            <RouterLink class="btn-link" :to="`/items/${b.id}`">
                                <IconEye class="h-4 w-4" />
                            </RouterLink>
                        </template>
                        <template v-else>
                            <RouterLink
                                class="btn-link"
                                :to="`/counter/${b.id}`"
                            >
                                <IconPencil class="h-4 w-4" />
                            </RouterLink>
                        </template>
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

        <template #footer>
            <CreateForm @create="onCreate" />
        </template>
    </MobileLayout>
</template>
