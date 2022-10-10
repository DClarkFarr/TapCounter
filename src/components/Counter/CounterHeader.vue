<script lang="ts" setup>
import Header from "../Layout/Header.vue";
import IconStopCircle from "~icons/fa-solid/stop-circle";
import IconBackArrow from "~icons/fa-solid/arrow-alt-circle-left";
import IconArrowLeft from "~icons/fa-solid/arrow-left";
import useCounterStore from "@/stores/useCounterStore";
import useAuthStore from "@/stores/useAuthStore";

const counter = useCounterStore();
const auth = useAuthStore();
</script>

<template>
    <Header>
        <template #iconLeft>
            <div v-if="counter.view === 'app'">
                <div class="flex gap-x-2 items-center">
                    <div>
                        <RouterLink
                            to="/list"
                            class="btn btn-sm bg-gray-800 hover:bg-gray-900 flex gap-x-1"
                        >
                            <IconArrowLeft class="w-4" />
                            Back
                        </RouterLink>
                    </div>
                    <div>
                        <div class="text-xs opacity-[0.85] text-white">
                            Session Name
                        </div>
                        <div>
                            {{ counter.name }}
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template #iconRight>
            <div>
                <button
                    class="btn btn-sm text-center text-xs bg-red-700"
                    @click="
                        counter.confirmEndSession(counter.view !== 'confirmEnd')
                    "
                >
                    <div>
                        <IconStopCircle
                            class="mx-auto mb-1"
                            v-if="counter.view !== 'confirmEnd'"
                        />
                        <IconBackArrow class="mx-auto" v-else />
                    </div>
                    {{ counter.view === "app" ? "Complete Batch" : "Go back" }}
                </button>
            </div>
        </template>

        <div class="font-semibold text-xl text-center">
            {{ auth.selectedStore?.name || "Store Name" }}
        </div>
        <div class="font-light text-lg text-center opacity-[0.75]">
            Load items
        </div>
    </Header>
</template>
