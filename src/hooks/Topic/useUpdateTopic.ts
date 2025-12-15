import { put } from "@/utils/apiClient";
import { TopicInput } from "@/utils/type";
import { useCallback } from "react";

const useUpdateTopic = () => {
    const updateTopic = useCallback(async (id: string, body: TopicInput) => {
        try {
            const updated = await put(`/topic/${id}`, body);
            return updated;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { updateTopic };
};

export default useUpdateTopic;
