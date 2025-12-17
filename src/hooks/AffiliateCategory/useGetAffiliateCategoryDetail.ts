import { get } from '@/utils/request';
import { useCallback } from 'react';

const useGetAffiliateCategoryDetail = () => {
    const fetchAffiliateCategoryDetail = useCallback(async (id: string) => {
        try {
            const res = await get(`/affiliate-category/${id}`);
            return res;
        } catch (error) {
            console.error('Error fetching affiliate category detail:', error);
            throw error;
        }
    }, []);

    return { fetchAffiliateCategoryDetail };
};

export default useGetAffiliateCategoryDetail;
