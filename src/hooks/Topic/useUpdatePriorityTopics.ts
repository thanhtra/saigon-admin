import { post } from "@/utils/apiClient";
import { useCallback } from "react";

const useUpdatePriorityTopics = () => {
    const updatePriorityTopics = useCallback(async (topicIds: string[]) => {
        try {
            const updated = await post(`/topic/priority`, { topicIds });
            return updated;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { updatePriorityTopics };
};

export default useUpdatePriorityTopics;
