<script lang="ts" setup>
import { StoreItem } from "@/types/StoreTypes";
import { computed, onMounted, ref } from "vue";
import apiClient from "@/services/apiClient";

const emit = defineEmits<{
    (e: "selected"): void;
}>();
const selected = ref("");
const message = ref("");

const onSelectStore = (e: Event) => {
    const target = e.target as HTMLInputElement;
    selected.value = target.value;
};

const stores = ref<StoreItem[]>([]);

const codeInput = ref("");

const isSubmitting = ref(false);
const onSubmit = () => {
    isSubmitting.value = true;
    apiClient
        .post("/auth", {
            id: selected.value,
            code: codeInput.value,
        })
        .then(() => {
            codeInput.value = "";
            emit("selected");
        })
        .catch((err) => {
            message.value = err.response.data.message || err.message;
        })
        .finally(() => {
            isSubmitting.value = false;
        });
};

const isValid = computed(() => {
    return codeInput.value.length > 0;
});

onMounted(() => {
    apiClient.get<{ stores: StoreItem[] }>("/store").then((response) => {
        stores.value = response.data.stores;
    });
});
</script>
<template>
    <div class="store-selector text-left">
        <form @submit.prevent="onSubmit" action="" method="POST">
            <div class="text-lg font-semibold">Select Your Location</div>
            <div class="mb-4">
                <select class="input" @change="onSelectStore">
                    <option value="">Location List</option>
                    <option
                        v-for="store in stores"
                        :value="store.id"
                        :selected="store.id === selected"
                    >
                        {{ store.name }}
                    </option>
                </select>
            </div>

            <template v-if="selected">
                <div class="mb-4">
                    <label>Store Code</label>
                    <input
                        class="input"
                        placeholder="Enter store code"
                        v-model="codeInput"
                    />
                </div>

                <div class="mb-4 text-red-700" v-if="message">
                    {{ message }}
                </div>
                <div>
                    <button
                        class="btn bg-sky-700 hover:bg-sky-800 block w-full"
                        :disabled="isSubmitting || !isValid"
                    >
                        {{ isSubmitting ? "Selecting..." : "Select Store" }}
                    </button>
                </div>
            </template>
        </form>
    </div>
</template>
