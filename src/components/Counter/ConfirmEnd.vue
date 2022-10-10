<script lang="ts" setup>
import useCounterStore from "@/stores/useCounterStore";
import { useRouter } from "vue-router";

const counter = useCounterStore();
const router = useRouter();

const onEndSession = () => {
    counter.endSession().then(() => {
        router.push("/list");
    });
};
</script>

<template>
    <div class="h-full flex flex-col justify-center items-center text-center">
        <div class="pb-[100px]">
            <h1 class="font-bold text-3xl mb-4">Really end session?</h1>

            <button class="btn bg-emerald-700" @click="onEndSession">
                Yes, end session
            </button>
        </div>
    </div>
</template>
