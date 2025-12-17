import { get } from '@/utils/request';
import { useCallback } from 'react';

type GetAffiliatesParams = {
    affiliate_category_id?: string;
    page?: number;
    size?: number;
    keySearch?: string;
};

const useGetAffiliates = () => {
    const fetchAffiliates = useCallback(async (params?: GetAffiliatesParams) => {
        try {
            const data = await get('/affiliate', params);
            return data;
        } catch (error) {
            console.error('Error fetching Affiliate:', error);
            throw error;
        }
    }, []);

    return { fetchAffiliates };
};

export default useGetAffiliates;
