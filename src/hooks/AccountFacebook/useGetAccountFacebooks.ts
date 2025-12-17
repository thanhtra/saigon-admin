import { get } from '@/utils/request';
import { useCallback } from 'react';

type Params = {
    page?: number;
    size?: number;
    keySearch?: string;
    isPagin?: boolean;
};

const useGetAccountFacebooks = () => {
    const fetchAccountFacebooks = useCallback(async (params?: Params) => {
        try {
            const data = await get('/account-facebook', params);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }, []);

    return { fetchAccountFacebooks };
};

export default useGetAccountFacebooks;
