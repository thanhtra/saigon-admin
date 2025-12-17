import { del } from '@/utils/request';
import { useCallback } from 'react';

const useDeleteTiktokVideo = () => {
    const deleteTiktokVideo = useCallback(async (id: string) => {
        try {
            const res = await del(`/video-tiktok/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting TikTok video:', error);
            throw error;
        }
    }, []);

    return { deleteTiktokVideo };
};

export default useDeleteTiktokVideo;
