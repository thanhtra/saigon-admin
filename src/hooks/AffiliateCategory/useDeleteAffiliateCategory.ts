import { del } from '@/utils/request';
import { useCallback } from 'react';

const useDeleteAffiliateCategory = () => {
    const deleteAffiliateCategory = useCallback(async (id: string) => {
        try {
            const res = await del(`/affiliate-category/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting affiliate category:', error);
            throw error;
        }
    }, []);

    return { deleteAffiliateCategory };
};

export default useDeleteAffiliateCategory;
