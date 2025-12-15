import { post } from "@/utils/apiClient";
import { AffiliateInput } from "@/utils/type";
import { useCallback } from "react";


const useCreateAffiliate = () => {
    const createAffiliate = useCallback(async (body: AffiliateInput) => {
        try {
            const res = await post("/affiliate", body);
            return res;
        } catch (error) {
            console.error("Error creating Affiliate:", error);
            throw error;
        }
    }, []);

    return { createAffiliate };
};

export default useCreateAffiliate;
