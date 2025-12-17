import { del } from '@/utils/request';
import { useCallback } from 'react';

const useDeleteGmail = () => {
    const deleteGmail = useCallback(async (id: string) => {
        try {
            const res = await del(`/gmails/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting:', error);
            throw error;
        }
    }, []);

    return { deleteGmail };
};

export default useDeleteGmail;
