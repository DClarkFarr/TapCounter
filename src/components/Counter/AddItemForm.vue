<script lang="ts" setup>
import useCounterStore from "@/stores/useCounterStore";
import IconCheckCircle from "~icons/fa-solid/check-circle";

const counter = useCounterStore();

const onSubmit = () => {
    counter.addItem({
        name: counter.input,
        quantity: 1,
    });
};

const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;

    let value = target.value.trim();
    if (value.length > 4) {
        value = value.slice(0, 4);
    }

    counter.setInput(value);
};
</script>

<template>
    <div class="add-item-form">
        <form action="" class="" @submit.prevent="onSubmit" method="POST">
            <div class="flex gap-x-2 items-center">
                <div class="grow">
                    <input
                        class="input input-lg text-gray-500 focus:text-gray-700"
                        placeholder="Item # (Last 4 digits)"
                        type="number"
                        v-model="counter.input"
                        @input="handleInputChange"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        class="btn btn-lg bg-sky-700"
                        :disabled="!counter.inputValid"
                    >
                        <div class="flex items-center py-[5px]">
                            <IconCheckCircle class="mr-2" />
                            <span class="leading-none"> Add Item </span>
                        </div>
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>
