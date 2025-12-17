import { get } from '@/utils/request';
import { useCallback } from 'react';

type Params = {
    page?: number;
    size?: number;
    keySearch?: string;
    topic_id?: string;
};

const useGetGroupFacebooks = () => {
    const getGroupFacebooks = useCallback(async (params?: Params) => {
        try {
            const data = await get('/group-facebook', params);
            return data;
        } catch (error) {
            console.error('Error fetching group facebok:', error);
            throw error;
        }
    }, []);

    return { getGroupFacebooks };
};

export default useGetGroupFacebooks;
