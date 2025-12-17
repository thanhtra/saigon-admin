import { get } from '@/utils/request';
import { useCallback } from 'react';

type GetAffiliateCategoriesParams = {
    page?: number;
    size?: number;
    keySearch?: string;
    type?: string;
    isPagin?: boolean;
};

const useGetAffiliateCategories = () => {
    const fetchAffiliateCategories = useCallback(async (params?: GetAffiliateCategoriesParams) => {
        try {
            const data = await get('/affiliate-category', params);
            return data;
        } catch (error) {
            console.error('Error fetching affiliate categories:', error);
            throw error;
        }
    }, []);

    return { fetchAffiliateCategories };
};

export default useGetAffiliateCategories;
