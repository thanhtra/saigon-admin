import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

const useGetAccountFacebookDetail = () => {
    const getAccountFacebookDetail = useCallback(async (id: string) => {
        try {
            const res = await get(`/account-facebook/${id}`);
            return res;
        } catch (error) {
            console.error('Error fetching account facebook detail:', error);
            throw error;
        }
    }, []);

    return { getAccountFacebookDetail };
};

export default useGetAccountFacebookDetail;
