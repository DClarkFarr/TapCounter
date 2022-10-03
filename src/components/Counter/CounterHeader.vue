<script lang="ts" setup>
import Header from "../Layout/Header.vue";
import IconStopCircle from "~icons/fa-solid/stop-circle";
import IconBackArrow from "~icons/fa-solid/arrow-alt-circle-left";
import useCounterStore from "@/stores/useCounterStore";

const counter = useCounterStore();
</script>

<template>
    <Header>
        <template #iconLeft>
            <div v-if="counter.status === 'active'">
                <div class="text-xs opacity-[0.85] text-white">
                    Session Name
                </div>
                <div>
                    {{ counter.name }}
                </div>
            </div>
        </template>

        <template #iconRight>
            <div v-if="counter.status === 'active'">
                <button
                    class="btn btn-sm text-center text-xs bg-red-700"
                    @click="
                        counter.confirmEndSession(counter.view !== 'confirmEnd')
                    "
                >
                    <div>
                        <IconStopCircle
                            class="mx-auto"
                            v-if="counter.view !== 'confirmEnd'"
                        />
                        <IconBackArrow class="mx-auto" v-else />
                    </div>
                    {{ counter.view === "app" ? "End Session" : "Go back" }}
                </button>
            </div>
        </template>

        <h1 class="font-semibold text-xl text-center">Tap Counter</h1>
    </Header>
</template>
