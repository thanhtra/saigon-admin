import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

type Params = {
    page?: number;
    size?: number;
    keySearch?: string;
    category?: string;
};

const useGetProductTiktoks = () => {
    const getProductTiktoks = useCallback(async (params?: Params) => {
        try {
            const data = await get('/product-tiktok', params);
            return data;
        } catch (error) {
            console.error('Error fetching product tiktok:', error);
            throw error;
        }
    }, []);

    return { getProductTiktoks };
};

export default useGetProductTiktoks;
