import { put } from '@/utils/request';
import { ThreadInput } from '@/utils/type';
import { useCallback } from 'react';

const useUpdateThread = () => {
    const updateThread = useCallback(async (id: string, body: ThreadInput) => {
        try {
            const updated = await put(`/threads/${id}`, body);
            return updated;
        } catch (error) {
            console.error('Error updating Thread:', error);
            throw error;
        }
    }, []);

    return { updateThread };
};

export default useUpdateThread;
