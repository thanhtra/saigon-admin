import { put } from "@/utils/apiClient";
import { AccountFacebook } from "@/utils/type";
import { useCallback } from "react";

const useUpdateAccountFacebook = () => {
    const updateAccountFacebook = useCallback(async (id: string, body: AccountFacebook) => {
        try {
            const updated = await put(`/account-facebook/${id}`, body);
            return updated;
        } catch (error) {
            console.error('Error updating:', error);
            throw error;
        }
    }, []);

    return { updateAccountFacebook };
};

export default useUpdateAccountFacebook;
