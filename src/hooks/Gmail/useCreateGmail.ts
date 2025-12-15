import { post } from "@/utils/apiClient";
import { Gmail } from "@/utils/type";
import { useCallback } from "react";

const useCreateGmail = () => {
    const createGmail = useCallback(async (body: Gmail) => {
        try {
            const res = await post("/gmails", body);
            return res;
        } catch (error) {
            console.error("Error creating:", error);
            throw error;
        }
    }, []);

    return { createGmail };
};

export default useCreateGmail;
