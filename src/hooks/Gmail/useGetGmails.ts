import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

type Params = {
    page?: number;
    size?: number;
    keySearch?: string;
};

const useGetGmails = () => {
    const getGmails = useCallback(async (params?: Params) => {
        try {
            const data = await get('/gmails', params);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }, []);

    return { getGmails };
};

export default useGetGmails;
