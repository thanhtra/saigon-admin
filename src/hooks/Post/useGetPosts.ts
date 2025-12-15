import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

type Params = {
    page?: number;
    size?: number;
    keySearch?: string;
    social?: string;
    topic_id?: string;
    collaborator_id?: string;
};

const useGetPosts = () => {
    const getPosts = useCallback(async (params?: Params) => {
        try {
            const data = await get('/posts', params);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }, []);

    return { getPosts };
};

export default useGetPosts;
