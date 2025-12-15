import { get } from '@/utils/apiClient';
import { useCallback } from 'react';


const useGetUnPosted = () => {
    const getUnPosted = useCallback(async (category: string) => {
        try {
            const data = await get(`/product-tiktok/category/${category}`);
            return data;
        } catch (error) {
            console.error('Error fetching product tiktok:', error);
            throw error;
        }
    }, []);

    return { getUnPosted };
};

export default useGetUnPosted;
