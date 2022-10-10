import BatchService from "@/services/BatchService";
import useAuthStore from "@/stores/useAuthStore";
import { Batch } from "@/types/BatchTypes";
import { DateTime } from "luxon";
import { onMounted, ref, watch } from "vue";

export const useBatches = () => {
    const auth = useAuthStore();

    const batches = ref<Batch[]>([]);
    const isLoading = ref(false);
    const loadingPromise = ref<Promise<Batch[]> | null>(null);

    const loadBatches = async () => {
        if (loadingPromise.value) {
            return loadingPromise.value;
        }

        isLoading.value = true;

        loadingPromise.value = BatchService.getBatches();

        loadingPromise.value
            .then((bs) => {
                batches.value = bs;
            })
            .catch((err) => {
                console.warn("Error loading batches", err);
            })
            .finally(() => {
                isLoading.value = false;
            });
    };

    const createBatch = async (data: { name: string }) => {
        const batch = await BatchService.createBatch(data);

        batches.value = [
            batch,
            ...batches.value.map((b) => ({
                ...b,
                completedAt: DateTime.now(),
            })),
        ];

        return batch;
    };

    onMounted(async () => {
        if (auth.selectedStore) {
            loadBatches();
        }
    });

    watch(
        () => auth.selectedStore,
        () => {
            if (auth.selectedStore) {
                loadBatches();
            }
        }
    );

    return {
        batches,
        isLoading,
        loadBatches,
        createBatch,
    };
};

export default useBatches;
