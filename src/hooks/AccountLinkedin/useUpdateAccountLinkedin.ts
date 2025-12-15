import { put } from "@/utils/apiClient";
import { AccountLinkedin } from "@/utils/type";
import { useCallback } from "react";

const useUpdateAccountLinkedin = () => {
    const updateAccountLinkedin = useCallback(async (id: string, body: AccountLinkedin) => {
        try {
            const updated = await put(`/linkedin-account/${id}`, body);
            return updated;
        } catch (error) {
            console.error('Error updating:', error);
            throw error;
        }
    }, []);

    return { updateAccountLinkedin };
};

export default useUpdateAccountLinkedin;
