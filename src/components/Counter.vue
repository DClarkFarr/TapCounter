<script lang="ts" setup>
import useCounterStore from "@/stores/useCounterStore";
import MobileLayout from "./Layout/MobileLayout.vue";
import IconStopCircle from "~icons/fa-solid/stop-circle";

const counter = useCounterStore();
</script>

<template>
    <MobileLayout>
        <template #header>
            <div class="flex items-center w-full justify-bewtween">
                <div class="shrink min-w-[100px]"></div>
                <div class="grow">
                    <h1 class="font-semibold text-xl text-center">
                        Tap Counter
                    </h1>
                </div>
                <div class="shrink min-w-[100px] -my-4">
                    <div v-if="counter.status === 'active'">
                        <button
                            class="btn btn-sm text-center text-xs bg-red-700"
                            @click="
                                counter.confirmEndSession(
                                    counter.view !== 'confirmEnd'
                                )
                            "
                        >
                            <div>
                                <IconStopCircle class="mx-auto" />
                            </div>
                            {{
                                counter.view === "app"
                                    ? "End Session"
                                    : "Go back"
                            }}
                        </button>
                    </div>
                </div>
            </div>
        </template>

        <template v-if="counter.status === 'active'">
            <template v-if="counter.view === 'app'"></template>
            <template v-else-if="counter.view === 'confirmEnd'">
                <div
                    class="h-full flex flex-col justify-center items-center text-center"
                >
                    <div class="pb-[100px]">
                        <h1 class="font-bold text-3xl mb-4">
                            Really end session?
                        </h1>

                        <button class="btn bg-emerald-700">
                            Yes, end session
                        </button>
                    </div>
                </div>
            </template>
            <template></template>
        </template>
        <template v-else-if="counter.status === 'inactive'">
            <div
                class="h-full flex flex-col justify-center items-center text-center"
            >
                <div class="pb-[100px]">
                    <h1 class="font-bold text-3xl mb-4">
                        Welcome to Load Counter
                    </h1>
                    <p class="text-lg mb-6">
                        Create a session to begin counting
                    </p>
                    <CreateForm class="mx-auto" />
                </div>
            </div>
        </template>
    </MobileLayout>
</template>
