// hooks/useGetYoutubeDetail.ts
import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

const useGetYoutubeDetail = () => {
    const fetchYoutubeDetail = useCallback(async (id: string) => {
        try {
            const data = await get(`/youtube/${id}`);
            return data;
        } catch (error) {
            console.error('Error fetching Youtube detail:', error);
            throw error;
        }
    }, []);

    return { fetchYoutubeDetail };
};

export default useGetYoutubeDetail;
