import { put } from "@/utils/apiClient";
import { FacebookPageInputUpdate } from "@/utils/type";
import { useCallback } from "react";

const useUpdateFacebookPage = () => {
    const updateFacebookPage = useCallback(async (id: string, body: FacebookPageInputUpdate) => {
        try {
            const updated = await put(`/facebook-page/${id}`, body);
            return updated;
        } catch (error) {
            console.error('Error updating Facebook page:', error);
            throw error;
        }
    }, []);

    return { updateFacebookPage };
};

export default useUpdateFacebookPage;
