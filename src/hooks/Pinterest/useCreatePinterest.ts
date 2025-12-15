import { post } from "@/utils/apiClient";
import { PinterestInput } from "@/utils/type";
import { useCallback } from "react";

const useCreatePinterest = () => {
    const createPinterest = useCallback(async (body: PinterestInput) => {
        try {
            const res = await post("/pinterest", body);
            return res;
        } catch (error) {
            console.error("Error creating Pinterest:", error);
            throw error;
        }
    }, []);

    return { createPinterest };
};

export default useCreatePinterest;
