<script lang="ts" setup>
import MobileLayout from "../Layout/MobileLayout.vue";
import WelcomeBlock from "../Counter/WelcomeBlock.vue";
import StoreSelector from "../Store/StoreSelector.vue";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const onSelected = () => {
    router.push("/list");
};
</script>

<template>
    <MobileLayout>
        <template #header>
            <Header>
                <template #iconLeft></template>
                <template #iconRight></template>

                <div>
                    <div class="font-semibold text-xl text-center">Home</div>
                    <div class="font-light text-lg text-center opacity-[0.75]">
                        Tap Counter
                    </div>
                </div>
            </Header>
        </template>

        <div class="content h-full">
            <WelcomeBlock>
                <StoreSelector
                    :selected="auth.payload.selectedStore"
                    @selected="onSelected"
                />
            </WelcomeBlock>
        </div>
    </MobileLayout>
</template>
