import { get } from '@/utils/request';
import { useCallback } from 'react';

const useGetAccountLinkedinDetail = () => {
    const getAccountLinkedinDetail = useCallback(async (id: string) => {
        try {
            const res = await get(`/linkedin-account/${id}`);
            return res;
        } catch (error) {
            console.error('Error fetching account linkedin detail:', error);
            throw error;
        }
    }, []);

    return { getAccountLinkedinDetail };
};

export default useGetAccountLinkedinDetail;
