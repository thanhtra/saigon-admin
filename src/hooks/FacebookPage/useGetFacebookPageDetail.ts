import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

const useGetFacebookPageDetail = () => {
    const fetchFacebookPageDetail = useCallback(async (id: string) => {
        try {
            const data = await get(`/facebook-page/${id}`);
            return data;
        } catch (error) {
            console.error('Error fetching Facebook page detail:', error);
            throw error;
        }
    }, []);

    return { fetchFacebookPageDetail };
};

export default useGetFacebookPageDetail;
