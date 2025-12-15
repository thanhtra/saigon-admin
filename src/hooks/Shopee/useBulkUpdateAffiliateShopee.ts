import { post } from "@/utils/apiClient";
import { useCallback } from "react";


const useBulkUpdateAffiliateShopee = () => {
    const bulkUpdateAffiliateShopee = useCallback(async (data: any) => {
        try {
            const res = await post("/shopee/bulk-update", data);
            return res;
        } catch (err) {
            console.error("Error in bulk update shopee:", err);
            return null;
        }
    }, []);

    return {
        bulkUpdateAffiliateShopee,
    };
};

export default useBulkUpdateAffiliateShopee;
