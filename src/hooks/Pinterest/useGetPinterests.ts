import { get } from '@/utils/request';
import { useCallback } from 'react';

type Params = {
    page?: number;
    size?: number;
    keySearch?: string;
    active?: boolean;
};

const useGetPinterests = () => {
    const getPinterests = useCallback(async (params?: Params) => {
        try {
            const data = await get('/pinterest', params);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }, []);

    return { getPinterests };
};

export default useGetPinterests;
