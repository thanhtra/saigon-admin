import { post } from "@/utils/apiClient";
import { ShopeeInput } from "@/utils/type";
import { useCallback } from "react";


const useCreateShopee = () => {
    const createShopee = useCallback(async (body: ShopeeInput) => {
        try {
            const res = await post("/shopee", body);
            return res;
        } catch (error) {
            console.error("Error creating shopee:", error);
            throw error;
        }
    }, []);

    return { createShopee };
};

export default useCreateShopee;
