import { post } from "@/utils/apiClient";
import { GenerateVideoProductTiktok } from "@/utils/type";
import { useCallback } from "react";

const useGenerateVideo = () => {
    const generateVideo = useCallback(async (body: GenerateVideoProductTiktok) => {
        try {
            const res = await post("/videos/generate-from-tiktok", body);
            return res;
        } catch (error) {
            console.error("Error creating:", error);
            throw error;
        }
    }, []);

    return { generateVideo };
};

export default useGenerateVideo;
