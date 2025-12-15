import { post } from "@/utils/apiClient";
import { YoutubeInput } from "@/utils/type";
import { useCallback } from "react";

const useCreateYoutube = () => {
    const createYoutube = useCallback(async (body: YoutubeInput) => {
        try {
            const res = await post("/youtube", body);
            return res;
        } catch (error) {
            console.error("Error creating Youtube video:", error);
            throw error;
        }
    }, []);

    return { createYoutube };
};

export default useCreateYoutube;
