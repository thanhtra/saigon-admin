import { post } from "@/utils/apiClient";
import { YoutubeUpdateToken } from "@/utils/type";
import { useCallback } from "react";

const useUpdateTokenYoutube = () => {
    const updateTokenYoutube = useCallback(async (body: YoutubeUpdateToken) => {
        try {
            const res = await post("/youtube/update-token", body);
            return res;
        } catch (error) {
            console.error("Error creating Youtube video:", error);
            throw error;
        }
    }, []);

    return { updateTokenYoutube };
};

export default useUpdateTokenYoutube;
