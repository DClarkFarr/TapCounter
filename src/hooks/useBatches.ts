import apiClient from "@/services/apiClient";
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

        loadingPromise.value = apiClient
            .get<{ batches: Batch<string>[] }>("/store/batch")
            .then(({ data: { batches } }) =>
                batches.map((b) => ({
                    ...b,
                    createdAt: DateTime.fromISO(b.createdAt),
                    completedAt: b.completedAt
                        ? DateTime.fromISO(b.completedAt)
                        : null,
                }))
            );

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
        const {
            data: { batch: dbBatch },
        } = await apiClient.post<{ batch: Batch<string> }>(
            "/store/batch",
            data
        );

        const batch: Batch = {
            ...dbBatch,
            createdAt: DateTime.fromISO(dbBatch.createdAt),
            completedAt: dbBatch.completedAt
                ? DateTime.fromISO(dbBatch.completedAt)
                : null,
        };

        batches.value = [batch, ...batches.value];

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
