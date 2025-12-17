import { get } from '@/utils/request';
import { useCallback } from 'react';

const useGetGmailDetail = () => {
    const getGmailDetail = useCallback(async (id: string) => {
        try {
            const data = await get(`/gmails/${id}`);
            return data;
        } catch (error) {
            console.error('Error fetching detail:', error);
            throw error;
        }
    }, []);

    return { getGmailDetail };
};

export default useGetGmailDetail;
