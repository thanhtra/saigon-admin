import { get } from '@/utils/request';
import { useCallback } from 'react';

type GetThreadsParams = {
    page?: number;
    size?: number;
    keySearch?: string;
};

const useGetThreads = () => {
    const getThreads = useCallback(async (params?: GetThreadsParams) => {
        try {
            const data = await get('/threads', params);
            return data;
        } catch (error) {
            console.error('Error fetching threads:', error);
            throw error;
        }
    }, []);

    return { getThreads };
};

export default useGetThreads;
