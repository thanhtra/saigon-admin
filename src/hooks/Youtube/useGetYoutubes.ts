import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

type GetYoutubesParams = {
    page?: number;
    size?: number;
    keySearch?: string;
    topic_id?: string;
    youtube_channel_id?: string;
};

const useGetYoutubes = () => {
    const fetchYoutubes = useCallback(async (params?: GetYoutubesParams) => {
        try {
            const data = await get('/youtube', params);
            return data;
        } catch (error) {
            console.error('Error fetching youtubes:', error);
            throw error;
        }
    }, []);

    return { fetchYoutubes };
};

export default useGetYoutubes;
