import { post } from "@/utils/apiClient";
import { GenerateVideoUrlYoutube } from "@/utils/type";
import { useCallback } from "react";

const useGenerateYoutube = () => {
    const generateYoutube = useCallback(async (body: GenerateVideoUrlYoutube) => {
        try {
            const res = await post("/videos/generate-from-youtube", body);
            return res;
        } catch (error) {
            console.error("Error creating:", error);
            throw error;
        }
    }, []);

    return { generateYoutube };
};

export default useGenerateYoutube;
