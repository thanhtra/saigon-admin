import { del } from '@/utils/apiClient';
import { useCallback } from 'react';

const useDeleteBroker = () => {
    const deleteBroker = useCallback(async (id: string) => {
        try {
            const res = await del(`/brokers/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting:', error);
            throw error;
        }
    }, []);

    return { deleteBroker };
};

export default useDeleteBroker;
