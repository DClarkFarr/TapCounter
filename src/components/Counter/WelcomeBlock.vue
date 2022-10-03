<script lang="ts" setup></script>

<template>
    <div class="h-full flex flex-col justify-center items-center text-center">
        <div class="pb-[100px]">
            <h1 class="font-bold text-3xl mb-4">Welcome to Load Counter</h1>
            <p class="text-lg mb-6">
                The one-stop box counting app for awesome people
            </p>
            <slot></slot>
        </div>
    </div>
</template>
