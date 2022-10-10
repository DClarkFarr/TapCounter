import { Batch } from "@/types/BatchTypes";
import { DateTime } from "luxon";

export const toBatch = (batch: Batch<string>): Batch => {
    return {
        ...batch,
        createdAt: DateTime.fromISO(batch.createdAt),
        completedAt: batch.completedAt
            ? DateTime.fromISO(batch.completedAt)
            : null,
    };
};
