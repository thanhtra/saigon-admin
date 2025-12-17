import { get } from '@/utils/request';
import { useCallback } from 'react';

const useGetTopicDetail = () => {
    const fetchTopicDetail = useCallback(async (id: string) => {
        try {
            const data = await get(`/topic/${id}`);
            return data;
        } catch (error) {
            console.error('Error fetching topic detail:', error);
            throw error;
        }
    }, []);

    return { fetchTopicDetail };
};

export default useGetTopicDetail;
