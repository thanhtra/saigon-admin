import { put } from "@/utils/apiClient";
import { AppFacebook } from "@/utils/type";
import { useCallback } from "react";

const useUpdateAppFacebook = () => {
    const updateAppFacebook = useCallback(async (id: string, body: AppFacebook) => {
        try {
            const updated = await put(`/app-facebook/${id}`, body);
            return updated;
        } catch (error) {
            console.error('Error updating:', error);
            throw error;
        }
    }, []);

    return { updateAppFacebook };
};

export default useUpdateAppFacebook;
