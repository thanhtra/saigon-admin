import { get } from '@/utils/request';
import { useCallback } from 'react';

type GetTiktokVideosParams = {
    page?: number;
    size?: number;
    keySearch?: string;
    topic_id?: string;
    facebook_page_posted_id?: string;
};

const useGetTiktokVideos = () => {
    const fetchTiktokVideos = useCallback(async (params?: GetTiktokVideosParams) => {
        try {
            const data = await get('/video-tiktok', params);
            return data;
        } catch (error) {
            console.error('Error fetching TikTok videos:', error);
            throw error;
        }
    }, []);

    return { fetchTiktokVideos };
};

export default useGetTiktokVideos;
