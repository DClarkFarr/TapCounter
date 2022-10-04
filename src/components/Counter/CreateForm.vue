<script lang="ts" setup>
import { DateTime } from "luxon";
import { computed, ref } from "vue";
import IconCircleNotch from "~icons/fa-solid/circle-notch";

const emit = defineEmits<{
    (event: "create", payload: { name: string }, resolve: () => void): void;
}>();

const isSubmitting = ref(false);

const name = ref(DateTime.now().toFormat("LLL dd, yyyy"));

const onSubmit = () => {
    if (!isValid.value) {
        return;
    }
    isSubmitting.value = true;

    emit("create", { name: name.value }, () => {
        isSubmitting.value = false;
    });
};

const isValid = computed(() => {
    return name.value.length > 0;
});
</script>

<template>
    <div class="create-form">
        <form method="POST" action="" @submit.prevent="onSubmit">
            <div class="flex gap-x-2 items-end w-full">
                <div class="text-left grow">
                    <label>Batch Name</label>
                    <div>
                        <input class="input" v-model="name" />
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        class="btn bg-emerald-700"
                        :disabled="!isValid || isSubmitting"
                    >
                        <template v-if="isSubmitting">
                            <IconCircleNotch class="animate-spin h-4 w-4" />
                        </template>
                        <template v-else> Create </template>
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>
