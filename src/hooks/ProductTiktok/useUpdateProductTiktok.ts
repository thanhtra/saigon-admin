import { put } from "@/utils/apiClient";
import { ProductTiktokUpdate } from "@/utils/type";
import { useCallback } from "react";

const useUpdateProductTiktok = () => {
    const updateProductTiktok = useCallback(async (id: string, body: ProductTiktokUpdate) => {
        try {
            const updated = await put(`/product-tiktok/${id}`, body);
            return updated;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { updateProductTiktok };
};

export default useUpdateProductTiktok;
