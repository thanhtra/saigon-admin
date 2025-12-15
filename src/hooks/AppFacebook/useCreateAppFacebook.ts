import { post } from "@/utils/apiClient";
import { AppFacebook } from "@/utils/type";
import { useCallback } from "react";


const useCreateAppFacebook = () => {
    const createAppFacebook = useCallback(async (body: AppFacebook) => {
        try {
            const res = await post("/app-facebook", body);
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { createAppFacebook };
};

export default useCreateAppFacebook;
