import { post } from "@/utils/apiClient";
import { PinterestUpdateToken } from "@/utils/type";
import { useCallback } from "react";

const useUpdateTokenPinterest = () => {
    const updateTokenPinterest = useCallback(async (body: PinterestUpdateToken) => {
        try {
            const res = await post("/pinterest/update-token", body);
            return res;
        } catch (error) {
            console.error("Error update token pinterest:", error);
            throw error;
        }
    }, []);

    return { updateTokenPinterest };
};

export default useUpdateTokenPinterest;
