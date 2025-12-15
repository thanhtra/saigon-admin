import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

const useGetCollaboratorDetail = () => {
    const getCollaboratorDetail = useCallback(async (id: string) => {
        try {
            const data = await get(`/collaborator/${id}`);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }, []);

    return { getCollaboratorDetail };
};

export default useGetCollaboratorDetail;
