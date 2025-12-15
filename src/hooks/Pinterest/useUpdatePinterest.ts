import { put } from '@/utils/apiClient';
import { PinterestInput } from '@/utils/type';
import { useCallback } from 'react';

const useUpdatePinterest = () => {
    const updatePinterest = useCallback(async (id: string, body: PinterestInput) => {
        try {
            const updated = await put(`/pinterest/${id}`, body);
            return updated;
        } catch (error) {
            console.error('Error updating:', error);
            throw error;
        }
    }, []);

    return { updatePinterest };
};

export default useUpdatePinterest;
