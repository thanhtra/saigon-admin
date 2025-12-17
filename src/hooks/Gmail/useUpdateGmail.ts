import { put } from '@/utils/request';
import { Gmail } from '@/utils/type';
import { useCallback } from 'react';

const useUpdateGmail = () => {
    const updateGmail = useCallback(async (id: string, body: Gmail) => {
        try {
            const updated = await put(`/gmails/${id}`, body);
            return updated;
        } catch (error) {
            console.error('Error updating:', error);
            throw error;
        }
    }, []);

    return { updateGmail };
};

export default useUpdateGmail;
