import { post } from "@/utils/apiClient";
import { useCallback } from "react";


const useBulkCreateAffiliates = () => {

    const bulkCreateAffiliates = useCallback(async (affiliateData: any[]) => {
        try {
            const res = await post("/affiliate/bulk", { data: affiliateData });
            return res;
        } catch (err) {
            console.error("Error in bulk create affiliate:", err);
            return null;
        }
    }, []);

    return {
        bulkCreateAffiliates,
    };
};

export default useBulkCreateAffiliates;
