

import { put } from "@/utils/apiClient";
import { useCallback } from "react";

const useMarkAsPosted = () => {
    const markAsPosted = useCallback(async (id: string) => {
        try {
            const updated = await put(`/product-tiktok/mark-as-posted/${id}`, {});
            return updated;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { markAsPosted };
};

export default useMarkAsPosted;
