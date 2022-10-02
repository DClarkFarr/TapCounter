<script lang="ts" setup>
import useCounterStore from "@/stores/useCounterStore";
import { DateTime } from "luxon";
import { computed, ref } from "vue";

const counter = useCounterStore();
const name = ref(DateTime.now().toFormat("LLL dd, yyyy"));

const onSubmit = () => {
    console.log("starting session");
    counter.startSession(name.value);
};

const isValid = computed(() => {
    return name.value.length > 0;
});
</script>

<template>
    <div class="create-form">
        <form method="POST" action="" @submit.prevent="onSubmit">
            <div class="flex gap-x-2 items-end w-full">
                <div class="text-left grow">
                    <label>Session Name</label>
                    <div>
                        <input class="input" v-model="name" />
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        class="btn bg-emerald-700"
                        :disabled="!isValid"
                    >
                        Start
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>
