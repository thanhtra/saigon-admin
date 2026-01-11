import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

const useGetRentalDetail = () => {
    const [loading, setLoading] = useState(false);

    const getRentalDetail = useCallback(async (id: string): Promise<any> => {
        setLoading(true);
        try {
            return await get(`/rentals/admin/${id}`);
        } catch (error) {
            console.log('Error getRentalDetail: ', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getRentalDetail, loading };
};

export default useGetRentalDetail;