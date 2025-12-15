import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

const useGetThreadDetail = () => {
    const getThreadDetail = useCallback(async (id: string) => {
        try {
            const data = await get(`/threads/${id}`);
            return data;
        } catch (error) {
            console.error('Error fetching Threads detail:', error);
            throw error;
        }
    }, []);

    return { getThreadDetail };
};

export default useGetThreadDetail;
