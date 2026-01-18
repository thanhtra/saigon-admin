import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

const useGetBookingDetail = () => {
    const [loading, setLoading] = useState(false);

    const getBookingDetail = useCallback(async (id: string): Promise<any> => {
        setLoading(true);
        try {
            return await get(`/bookings/${id}/admintra`);
        } catch (error) {
            console.log('Error getBookingDetail: ', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getBookingDetail, loading };
};

export default useGetBookingDetail;