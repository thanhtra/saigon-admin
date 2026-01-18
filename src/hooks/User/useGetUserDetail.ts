import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

const useGetUserDetail = () => {
    const [loading, setLoading] = useState(false);

    const getUserDetail = useCallback(async (id: string): Promise<any> => {
        setLoading(true);
        try {
            return await get(`/users/${id}/admintra`);
        } catch (error) {
            console.log('Error getUserDetail: ', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getUserDetail, loading };
};

export default useGetUserDetail;