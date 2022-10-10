import { toBatch } from "@/methods/batch";
import { Item } from "@/stores/useCounterStore";
import { Batch } from "@/types/BatchTypes";
import { DateTime } from "luxon";
import apiClient from "./apiClient";

export default class BatchService {
    static completeBatch(batchId: string) {
        return apiClient.post<{ batch: Batch<string> }>(
            `/store/batch/${batchId}/complete`
        );
    }

    static getBatch(batchId: string) {
        return apiClient
            .get<{ batch: Batch<string> }>(`/store/batch/${batchId}`)
            .then(({ data }) => toBatch(data.batch));
    }

    static saveItems(batchId: string, items: Item[]) {
        return apiClient.put(`/store/batch/${batchId}`, {
            items,
        });
    }

    static getBatches() {
        return apiClient
            .get<{ batches: Batch<string>[] }>("/store/batch")
            .then(({ data: { batches } }) => batches.map((b) => toBatch(b)));
    }

    static async createBatch(data: { name: string }) {
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

        return batch;
    }
}
