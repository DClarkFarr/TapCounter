<script lang="ts" setup>
import MobileLayout from "../Layout/MobileLayout.vue";
import useAuthStore from "@/stores/useAuthStore";

const auth = useAuthStore();
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

        <div class="store-list"></div>
    </MobileLayout>
</template>
