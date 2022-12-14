import { toBatch } from "@/methods/batch";
import { socket } from "@/services/socketIo";
import useAuthStore from "@/stores/useAuthStore";
import { Batch } from "@/types/BatchTypes";
import { computed, ComputedGetter, ComputedRef, watch } from "vue";

const useSocket = () => {
    const auth = useAuthStore();

    const storeId = computed(() => auth.selectedStore?.id || "");

    const onBatchEvent = (
        batchId: ComputedRef<string | undefined>,
        { onChange }: { onChange: (batch: Batch) => void }
    ) => {
        watch(
            [batchId, storeId],
            () => {
                socket.on(`${storeId.value} ${batchId.value} update`, onChange);
            },
            { immediate: true }
        );
    };

    const onStoreEvent = ({
        onCreate,
        onUpdate,
    }: {
        onCreate?: (batch: Batch) => void;
        onUpdate?: (batch: Batch) => void;
    }) => {
        watch(
            [storeId],
            () => {
                if (storeId.value) {
                    socket.on(
                        `${storeId.value} batch update`,
                        (batch: Batch<string>) => {
                            if (onUpdate) {
                                onUpdate(toBatch(batch));
                            }
                        }
                    );

                    socket.on(
                        `${storeId.value} batch create`,
                        (batch: Batch<string>) => {
                            if (onCreate) {
                                onCreate(toBatch(batch));
                            }
                        }
                    );
                }
            },
            {
                immediate: true,
            }
        );
    };

    return {
        onBatchEvent,
        onStoreEvent,
    };
};

export default useSocket;
