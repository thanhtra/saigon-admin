import { get } from '@/utils/request';
import { useCallback } from 'react';

type Params = {
    page?: number;
    size?: number;
    keySearch?: string;
    isPagin?: boolean
};

const useGetAppFacebooks = () => {
    const getAppFacebooks = useCallback(async (params?: Params) => {
        try {
            const data = await get('/app-facebook', params);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }, []);

    return { getAppFacebooks };
};

export default useGetAppFacebooks;
