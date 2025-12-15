import { post } from "@/utils/apiClient";
import { CronJobInput } from "@/utils/type";
import { useCallback } from "react";

const useCreateCronJob = () => {
    const createCronJob = useCallback(async (body: CronJobInput) => {
        try {
            const res = await post("/manage-post", body);
            return res;
        } catch (error) {
            console.error("Error creating Cron Job:", error);
            throw error;
        }
    }, []);

    return { createCronJob };
};

export default useCreateCronJob;
