import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

type Params = {
    type?: string;
    page?: number;
    size?: number;
    keySearch?: string;
    isPagin?: boolean;
    category_id?: string
};

const useGetTopics = () => {
    const fetchTopics = useCallback(async (params?: Params) => {
        try {
            const data = await get('/topic', params);
            return data;
        } catch (error) {
            console.error('Error fetching topics:', error);
            throw error;
        }
    }, []);

    return { fetchTopics };
};

export default useGetTopics;
