import { del } from '@/utils/apiClient';
import { useCallback } from 'react';

const useDeleteCollaborator = () => {
    const deleteCollaborator = useCallback(async (id: string) => {
        try {
            const res = await del(`/collaborator/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting:', error);
            throw error;
        }
    }, []);

    return { deleteCollaborator };
};

export default useDeleteCollaborator;
