import { get } from '@/utils/request';
import { useCallback } from 'react';

type Params = {
    page?: number;
    size?: number;
    keySearch?: string;
};

const useGetBrokers = () => {
    const getBrokers = useCallback(async (params?: Params) => {
        try {
            const data = await get('/brokers', params);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }, []);

    return { getBrokers };
};

export default useGetBrokers;
