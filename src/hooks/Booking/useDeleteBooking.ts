import { del } from '@/utils/request';
import { useCallback, useState } from 'react';

const useDeleteBooking = () => {
    const [loading, setLoading] = useState(false);

    const deleteBooking = useCallback(async (id: string): Promise<any> => {
        setLoading(true);
        try {
            return await del(`/bookings/${id}/admintra`);
        } catch (error) {
            console.error('Error deleteBooking:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteBooking, loading };
};

export default useDeleteBooking;