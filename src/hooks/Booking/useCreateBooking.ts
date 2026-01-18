import { CreateBookingInput } from '@/types/booking';
import { post } from '@/utils/request';
import { useCallback, useState } from 'react';


const useCreateBooking = () => {
	const [loading, setLoading] = useState(false);

	const createBooking = useCallback(async (body: CreateBookingInput): Promise<any> => {
		setLoading(true);
		try {
			return await post('/bookings/admintra', body);
		} catch (error) {
			console.log('Error createBooking: ', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	return { createBooking, loading };
};

export default useCreateBooking;