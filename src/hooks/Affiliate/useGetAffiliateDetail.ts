import { get } from '@/utils/request';
import { useCallback } from 'react';

const useGetAffiliateDetail = () => {
    const fetchAffiliateDetail = useCallback(async (id: string) => {
        try {
            const data = await get(`/affiliate/${id}`);
            return data;
        } catch (error) {
            console.error('Error fetching Affiliate detail:', error);
            throw error;
        }
    }, []);

    return { fetchAffiliateDetail };
};

export default useGetAffiliateDetail;