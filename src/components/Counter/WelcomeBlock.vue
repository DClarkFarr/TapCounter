<script lang="ts" setup>
import CreateForm from "./CreateForm.vue";
</script>

<template>
    <div class="h-full flex flex-col justify-center items-center text-center">
        <div class="pb-[100px]">
            <h1 class="font-bold text-3xl mb-4">Welcome to Load Counter</h1>
            <p class="text-lg mb-6">Create a session to begin counting</p>
            <CreateForm class="mx-auto" />
        </div>
    </div>
</template>
