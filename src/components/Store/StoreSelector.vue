<script lang="ts" setup>
import { Store } from "@/types/StoreTypes";
import { computed, onMounted, ref } from "vue";
import apiClient from "@/services/apiClient";

const props = defineProps<{
    selected?: string;
}>();

const emit = defineEmits<{
    (e: "select", id: string): void;
}>();

const onSelectStore = (e: Event) => {
    const target = e.target as HTMLInputElement;
    emit("select", target.value);
};

const stores = ref<Store[]>([]);

const codeInput = ref("");

const isSubmitting = ref(false);
const onSubmit = () => {
    isSubmitting.value = true;
    apiClient
        .post("/store", {
            id: props.selected,
            code: codeInput.value,
        })
        .then(() => {
            codeInput.value = "";
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            isSubmitting.value = false;
        });
};

const isValid = computed(() => {
    return codeInput.value.length > 0;
});

onMounted(() => {
    apiClient.get<{ stores: Store[] }>("/store").then((response) => {
        stores.value = response.data.stores;
    });
});
</script>
<template>
    <div class="store-selector text-left">
        <form @submit.prevent="onSubmit" action="" method="POST">
            <div class="text-lg font-semibold text-center">
                Select Your Location
            </div>
            <div class="mb-4">
                <select class="input" @change="onSelectStore">
                    <option value="">Location List</option>
                    <option
                        v-for="store in stores"
                        :value="store.id"
                        :selected="store.id === props.selected"
                    >
                        {{ store.name }}
                    </option>
                </select>
            </div>

            <div class="mb-4">
                <label>Store Code</label>
                <input
                    class="input"
                    placeholder="Enter store code"
                    v-model="codeInput"
                />
            </div>
            <div>
                <button
                    class="btn btn-sky-700 hover:btn-sky-800"
                    :disabled="isSubmitting || !isValid"
                >
                    {{ isSubmitting ? "Selecting..." : "Select Store" }}
                </button>
            </div>
        </form>
    </div>
</template>
