import { del } from '@/utils/request';
import { useCallback } from 'react';

const useDeleteAppFacebook = () => {
    const deleteAppFacebook = useCallback(async (id: string) => {
        try {
            const res = await del(`/app-facebook/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting:', error);
            throw error;
        }
    }, []);

    return { deleteAppFacebook };
};

export default useDeleteAppFacebook;
