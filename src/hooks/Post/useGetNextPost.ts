import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

type Params = {
    social?: string;
    topic_id?: string;
    collaborator_id?: string;
};

const useGetNextPost = () => {
    const getNextPost = useCallback(async (params?: Params) => {
        try {
            const data = await get('/posts/next-available', params);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }, []);

    return { getNextPost };
};

export default useGetNextPost;
