import { del } from '@/utils/apiClient'; // đảm bảo bạn có hàm del trong apiClient
import { useCallback } from 'react';

const useDeleteTopic = () => {
    const deleteTopic = useCallback(async (id: string) => {
        try {
            const res = await del(`/topic/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting topic:', error);
            throw error;
        }
    }, []);

    return { deleteTopic };
};

export default useDeleteTopic;
