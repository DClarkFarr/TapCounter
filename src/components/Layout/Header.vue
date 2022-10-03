<script lang="ts" setup></script>

<template>
    <div class="flex items-center w-full justify-bewtween">
        <div class="shrink min-w-[100px]">
            <slot name="iconLeft"> </slot>
        </div>
        <div class="grow">
            <slot> </slot>
        </div>
        <div class="shrink min-w-[100px] -my-4">
            <slot name="iconRight"> </slot>
        </div>
    </div>
</template>
