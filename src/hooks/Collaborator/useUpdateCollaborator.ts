import { put } from "@/utils/apiClient";
import { Collaborator } from "@/utils/type";
import { useCallback } from "react";

const useUpdateCollaborator = () => {
    const updateCollaborator = useCallback(async (id: string, body: Collaborator) => {
        try {
            const updated = await put(`/collaborator/${id}`, body);
            return updated;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { updateCollaborator };
};

export default useUpdateCollaborator;
