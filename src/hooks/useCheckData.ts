import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

type Params = {
    type: string;
};

const useCheckData = () => {
    const checkData = useCallback(async (params?: Params) => {
        try {
            const data = await get('/check-data', params);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }, []);

    return { checkData };
};

export default useCheckData;
