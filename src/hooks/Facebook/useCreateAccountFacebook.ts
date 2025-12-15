import { post } from "@/utils/apiClient";
import { AccountFacebook } from "@/utils/type";
import { useCallback } from "react";


const useCreateAccountFacebook = () => {
    const createAccountFacebook = useCallback(async (body: AccountFacebook) => {
        try {
            const res = await post("/account-facebook", body);
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { createAccountFacebook };
};

export default useCreateAccountFacebook;
