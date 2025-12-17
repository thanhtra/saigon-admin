import { get } from '@/utils/request';
import { useCallback } from 'react';

const useGetPinterestDetail = () => {
    const getPinterestDetail = useCallback(async (id: string) => {
        try {
            const data = await get(`/pinterest/${id}`);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }, []);

    return { getPinterestDetail };
};

export default useGetPinterestDetail;
