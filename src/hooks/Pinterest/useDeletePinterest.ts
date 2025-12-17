import { del } from '@/utils/request';
import { useCallback } from 'react';

const useDeletePinterest = () => {
    const deletePinterest = useCallback(async (id: string) => {
        try {
            const res = await del(`/pinterest/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting:', error);
            throw error;
        }
    }, []);

    return { deletePinterest };
};

export default useDeletePinterest;
