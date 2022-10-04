<script lang="ts" setup>
import { DateTime } from "luxon";
import { computed, ref } from "vue";
import IconCircleNotch from "~icons/fa-solid/circle-notch";
import IconPlus from "~icons/fa-solid/plus";

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
    <div class="create-form text-gray-600">
        <form method="POST" action="" @submit.prevent="onSubmit">
            <div class="flex gap-x-2 items-end w-full">
                <div class="text-left grow">
                    <div>
                        <input
                            class="input"
                            v-model="name"
                            placeholder="Batch Name"
                        />
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        class="btn bg-emerald-700 flex items-center"
                        :disabled="!isValid || isSubmitting"
                    >
                        <template v-if="isSubmitting">
                            <IconCircleNotch class="animate-spin h-4 w-4" />
                        </template>
                        <template v-else>
                            <IconPlus class="h-4 w-4 mr-2" />
                            Batch
                        </template>
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>
