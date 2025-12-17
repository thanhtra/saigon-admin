import { del } from '@/utils/request';
import { useCallback } from 'react';

const useDeleteYoutube = () => {
    const deleteYoutube = useCallback(async (id: string) => {
        try {
            const res = await del(`/youtube/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting Youtube video:', error);
            throw error;
        }
    }, []);

    return { deleteYoutube };
};

export default useDeleteYoutube;
