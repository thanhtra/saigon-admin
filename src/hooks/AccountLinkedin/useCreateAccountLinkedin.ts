import { post } from "@/utils/apiClient";
import { AccountLinkedin } from "@/utils/type";
import { useCallback } from "react";


const useCreateAccountLinkedin = () => {
    const createAccountLinkedin = useCallback(async (body: AccountLinkedin) => {
        try {
            const res = await post("/linkedin-account", body);
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { createAccountLinkedin };
};

export default useCreateAccountLinkedin;
