import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

const useGetAppFacebookDetail = () => {
    const getAppFacebookDetail = useCallback(async (id: string) => {
        try {
            const res = await get(`/app-facebook/${id}`);
            return res;
        } catch (error) {
            console.error('Error fetching detail:', error);
            throw error;
        }
    }, []);

    return { getAppFacebookDetail };
};

export default useGetAppFacebookDetail;
