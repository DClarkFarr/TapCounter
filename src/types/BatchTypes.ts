import { DateTime } from "luxon";

export type BatchItem = {
    name: string;
    quantity: number;
};

export type Batch<D = DateTime> = {
    id: string;
    storeId: string;
    name: string;
    createdAt: D;
    completedAt: D | null;
    items: BatchItem[];
};
