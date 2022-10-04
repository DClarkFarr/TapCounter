<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Counter from "../Counter.vue";

const route = useRoute();

const batchId = computed(() => route.params.batchId?.toString());
</script>

<template>
    <Counter :batch-id="batchId" />
</template>
