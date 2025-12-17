import { get } from '@/utils/request';
import { useCallback } from 'react';

type Params = {
    page?: number;
    size?: number;
    keySearch?: string;
};

const useGetShopees = () => {
    const getShopees = useCallback(async (params?: Params) => {
        try {
            const data = await get('/shopee', params);
            return data;
        } catch (error) {
            console.error('Error fetching shopees:', error);
            throw error;
        }
    }, []);

    return { getShopees };
};

export default useGetShopees;
