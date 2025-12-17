import { del } from '@/utils/request';
import { useCallback } from 'react';

const useDeleteAffiliate = () => {
    const deleteAffiliate = useCallback(async (id: string) => {
        try {
            const res = await del(`/affiliate/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting Affiliate:', error);
            throw error;
        }
    }, []);

    return { deleteAffiliate };
};

export default useDeleteAffiliate;
