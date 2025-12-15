import { post } from "@/utils/apiClient";
import { FacebookPageInput } from "@/utils/type";
import { useCallback } from "react";


const useCreateFacebookPage = () => {
    const createFacebookPage = useCallback(async (body: FacebookPageInput) => {
        try {
            const res = await post("/facebook-page", body);
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { createFacebookPage };
};

export default useCreateFacebookPage;
