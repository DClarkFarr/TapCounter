<script lang="ts" setup>
import useCounterStore, { Item } from "@/stores/useCounterStore";
import IconMinus from "~icons/fa-solid/minus";
import IconPlus from "~icons/fa-solid/plus";
import IconCheck from "~icons/fa-solid/check";
import { nextTick, ref, watchEffect } from "vue";
import { onLongPress } from "@vueuse/core";

const counter = useCounterStore();

const props = defineProps<{
    item: Item;
    selected: boolean;
    expand: boolean;
}>();

const refItem = ref<HTMLElement | null>(null);
const refInput = ref<HTMLInputElement | null>(null);

const input = ref(String(props.item.quantity));

const onLongPressCallbackHook = (e: PointerEvent) => {
    counter.setLongPressed(props.item.name);
};

onLongPress(refItem, onLongPressCallbackHook, {
    modifiers: { prevent: true },
    delay: 500,
});

const increase = () => {
    counter.updateItem(props.item.name, {
        quantity: parseInt(String(props.item.quantity)) + 1,
    });
};
const decrease = () => {
    if (props.item.quantity - 1 < 0) {
        return;
    }
    counter.updateItem(props.item.name, {
        quantity: parseInt(String(props.item.quantity)) - 1,
    });
};

const onCollapse = () => {
    counter.updateItem(props.item.name, {
        quantity: parseInt(input.value) || 0,
    });
};

const onChangeInput = (e: Event) => {
    const target = e.target as HTMLInputElement;

    let value = target.value.replace(/[^\d]/, "") || "";

    if (parseInt(value) < 0) {
        value = "0";
    }

    input.value = value;
};

watchEffect(async () => {
    if (props.expand) {
        await nextTick();
        // const end = refInput.value?.value?.length || 0;
        // refInput.value?.setSelectionRange(end, end);
        refInput.value?.focus();
    }
});
</script>

<template>
    <div
        class="counter-item rounded bg-white border-2 border-gray-300"
        :class="{
            'counter-item--selected': selected,
        }"
    >
        <div
            class="flex justify-center items-center gap-x-1 p-1"
            v-show="expand"
        >
            <div>
                <input
                    ref="refInput"
                    type="number"
                    min="0"
                    class="input"
                    placeholder="Quantity"
                    v-model="input"
                    @input="onChangeInput"
                />
            </div>
            <div>
                <button class="btn bg-emerald-700" @click="onCollapse">
                    <IconCheck class="my-[2px]" />
                </button>
            </div>
        </div>
        <div class="flex justify-center items-center p-1" v-show="!expand">
            <div class="shrink">
                <button
                    class="btn btn-sm bg-gray-300 text-gray-700"
                    @click="decrease"
                >
                    <IconMinus class="block my-1.5" />
                </button>
            </div>
            <div class="grow" ref="refItem">
                <div
                    class="flex gap-x-2 px-2 text-gray-500 justify-center items-center"
                >
                    <div class="counter-item__name text-center">
                        {{ item.name }}
                    </div>
                    <div
                        class="counter-item__quantity text-center font-bold text-lg"
                    >
                        #{{ item.quantity }}
                    </div>
                </div>
            </div>
            <div class="shrink">
                <button
                    class="btn btn-sm bg-gray-300 text-gray-700"
                    @click="increase"
                >
                    <IconPlus class="block my-1.5" />
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.counter-item {
    &--selected {
        @apply border-emerald-500 bg-emerald-100;
    }
}
</style>
