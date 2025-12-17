import { get } from '@/utils/request';
import { useCallback } from 'react';

export type GetFacebookPagesParams = {
    page?: number;
    size?: number;
    keySearch?: string;
    topic_id?: string;
    facebook_id?: string;
    active?: boolean
};

const useGetFacebookPages = () => {
    const fetchFacebookPages = useCallback(async (params?: GetFacebookPagesParams) => {
        try {
            const data = await get('/facebook-page', params);
            return data;
        } catch (error) {
            console.error('Error fetching facebook pages:', error);
            throw error;
        }
    }, []);

    return { fetchFacebookPages };
};

export default useGetFacebookPages;
