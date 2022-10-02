<script lang="ts" setup>
import { useSlots } from "vue";

const slots = useSlots();

const hasHeader = slots.header !== undefined;
const hasFooter = slots.footer !== undefined;
</script>

<template>
    <div
        class="mobile-layout mx-auto max-w-4xl mx-auto bg-sky-200 h-screen flex flex-col"
    >
        <div
            class="mobile-layout__header p-4 bg-sky-700 text-white shrink"
            v-if="hasHeader"
        >
            <slot name="header"></slot>
        </div>
        <div class="mobile-layout__content grow">
            <div class="mobile-layout__content-container h-full relative">
                <div class="absolute top-0 left-0 h-full w-full">
                    <div
                        class="relative w-full h-full overflow-x-auto overflow-y-auto"
                    >
                        <div class="p-4 h-full">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="mobile-layout__footer bg-slate-700 text-white p-4 shrink"
            v-if="hasFooter"
        >
            <slot name="footer"></slot>
        </div>
    </div>
</template>
