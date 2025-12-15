import { post } from "@/utils/apiClient";
import { ThreadInput } from "@/utils/type";
import { useCallback } from "react";

const useCreateThread = () => {
    const createThread = useCallback(async (body: ThreadInput) => {
        try {
            const res = await post("/threads", body);
            return res;
        } catch (error) {
            console.error("Error creating Thread:", error);
            throw error;
        }
    }, []);

    return { createThread };
};

export default useCreateThread;
