import { post } from '@/utils/apiClient';
import { useCallback } from 'react';

export interface TiktokVideoInput {
    video_link: string;
    video_title: string;
}

const useCreateTiktokVideo = () => {
    const createTiktokVideo = useCallback(async (videos: TiktokVideoInput[], topic_id: string, is_priority: boolean) => {
        try {
            const res = await post('/video-tiktok', { videos, topic_id, is_priority });
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { createTiktokVideo };
};

export default useCreateTiktokVideo;
