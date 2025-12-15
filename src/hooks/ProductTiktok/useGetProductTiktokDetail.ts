import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

const useGetProductTiktokDetail = () => {
    const getProductTiktokDetail = useCallback(async (id: string) => {
        try {
            const data = await get(`/product-tiktok/${id}`);
            return data;
        } catch (error) {
            console.error('Error fetching product tiktok detail:', error);
            throw error;
        }
    }, []);

    return { getProductTiktokDetail };
};

export default useGetProductTiktokDetail;
