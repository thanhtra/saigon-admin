import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

type Params = {
    page?: number;
    size?: number;
    keySearch?: string;
    isPagin?: boolean;
};

const useGetAccountLinkedIns = () => {
    const getAccountLinkedIns = useCallback(async (params?: Params) => {
        try {
            const data = await get('/linkedin-account', params);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }, []);

    return { getAccountLinkedIns };
};

export default useGetAccountLinkedIns;
