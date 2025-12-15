import { post } from "@/utils/apiClient";
import { LinkedInUpdateToken } from "@/utils/type";
import { useCallback } from "react";

const useUpdateTokenLinkedIn = () => {
    const updateTokenLinkedIn = useCallback(async (body: LinkedInUpdateToken) => {
        try {
            const res = await post("/linkedin-account/update-token", body);
            return res;
        } catch (error) {
            console.error("Error creating Youtube video:", error);
            throw error;
        }
    }, []);

    return { updateTokenLinkedIn };
};

export default useUpdateTokenLinkedIn;
