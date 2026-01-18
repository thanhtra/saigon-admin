import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

export type Params = {
    page?: number;
    size?: number;
    key_search?: string;
    is_pagin?: boolean;
};

const useGetBookings = () => {
    const [loading, setLoading] = useState(false);

    const getBookings = useCallback(async (params?: Params) => {
        setLoading(true);
        try {
            return await get('/bookings/admintra', params);
        } catch (error) {
            console.error('Error getBookings:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getBookings, loading };
};

export default useGetBookings;

