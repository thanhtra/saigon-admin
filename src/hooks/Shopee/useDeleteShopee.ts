import { del } from '@/utils/apiClient';
import { useCallback } from 'react';

const useDeleteShopee = () => {
    const deleteShopee = useCallback(async (id: string) => {
        try {
            const res = await del(`/shopee/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting shopee:', error);
            throw error;
        }
    }, []);

    return { deleteShopee };
};

export default useDeleteShopee;
