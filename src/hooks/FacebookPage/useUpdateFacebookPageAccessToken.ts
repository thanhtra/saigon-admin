import { put } from "@/utils/apiClient";
import { useCallback } from "react";

const useUpdateFacebookPageAccessToken = () => {
    const updateAccessToken = useCallback(async (id: string, page_access_token: string) => {
        try {
            const updated = await put(`/facebook-page/${id}`, { page_access_token });
            return updated;
        } catch (error) {
            console.error("Error updating page_access_token:", error);
            throw error;
        }
    }, []);

    return { updateAccessToken };
};

export default useUpdateFacebookPageAccessToken;
