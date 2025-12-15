import { del } from '@/utils/apiClient';
import { useCallback } from 'react';

const useDeleteProductTiktok = () => {
    const deleteProductTiktok = useCallback(async (id: string) => {
        try {
            const res = await del(`/product-tiktok/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting product tiktok:', error);
            throw error;
        }
    }, []);

    return { deleteProductTiktok };
};

export default useDeleteProductTiktok;
