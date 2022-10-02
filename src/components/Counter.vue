<script lang="ts" setup>
import useCounterStore from "@/stores/useCounterStore";
import MobileLayout from "./Layout/MobileLayout.vue";
import Header from "./Counter/Header.vue";
import ConfirmEnd from "./Counter/ConfirmEnd.vue";
import WelcomeBlock from "./Counter/WelcomeBlock.vue";
import IconCheckCircle from "~icons/fa-solid/check-circle";

const counter = useCounterStore();

const onSubmit = () => {};

const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;

    let value = target.value.trim();
    if (value.length > 4) {
        value = value.slice(0, 4);
    }

    console.log("setting", value);

    counter.setInput(value);
};
</script>

<template>
    <MobileLayout>
        <template #header>
            <Header />
        </template>

        <template v-if="counter.status === 'active'">
            <template v-if="counter.view === 'app'"></template>
            <ConfirmEnd v-else-if="counter.view === 'confirmEnd'" />
        </template>
        <WelcomeBlock v-else-if="counter.status === 'inactive'" />

        <template #footer>
            <div v-if="counter.status === 'active' && counter.view === 'app'">
                <div class="add-item-form">
                    <form
                        action=""
                        class=""
                        @submit.prevent="onSubmit"
                        method="POST"
                    >
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
                                        <span class="leading-none">
                                            Add Item
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </template>
    </MobileLayout>
</template>
