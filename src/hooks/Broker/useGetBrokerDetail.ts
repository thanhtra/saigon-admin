import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

const useGetBrokerDetail = () => {
    const getBrokerDetail = useCallback(async (id: string) => {
        try {
            const data = await get(`/brokers/${id}`);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }, []);

    return { getBrokerDetail };
};

export default useGetBrokerDetail;
