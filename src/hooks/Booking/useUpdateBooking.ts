import { CreateBookingForm } from '@/types/booking';
import { put } from '@/utils/request';
import { useCallback, useState } from 'react';

const useUpdateBooking = () => {
    const [loading, setLoading] = useState(false);

    const updateBooking = useCallback(async (id: string, body: Partial<CreateBookingForm>): Promise<any> => {
        setLoading(true);
        try {
            return await put(`/bookings/${id}/admintra`, body);
        } catch (error) {
            console.log('Error updateBooking: ', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateBooking, loading };
};

export default useUpdateBooking;