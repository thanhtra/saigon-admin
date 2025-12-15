import { del } from '@/utils/apiClient';
import { useCallback } from 'react';

const useDeleteGroupFacebook = () => {
    const deleteGroupFacebook = useCallback(async (id: string) => {
        try {
            const res = await del(`/group-facebook/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting group facebook:', error);
            throw error;
        }
    }, []);

    return { deleteGroupFacebook };
};

export default useDeleteGroupFacebook;
