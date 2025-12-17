import { del } from '@/utils/request';
import { useCallback } from 'react';

const useDeleteThread = () => {
    const deleteThread = useCallback(async (id: string) => {
        try {
            const res = await del(`/threads/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting Thread:', error);
            throw error;
        }
    }, []);

    return { deleteThread };
};

export default useDeleteThread;
