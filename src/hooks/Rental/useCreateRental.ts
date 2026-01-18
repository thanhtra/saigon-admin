import { RentalForm } from '@/types';
import { post } from '@/utils/request';
import { useCallback, useState } from 'react';


const useCreateRental = () => {
	const [loading, setLoading] = useState(false);

	const createRental = useCallback(async (body: RentalForm): Promise<any> => {
		setLoading(true);
		try {
			return await post('/rentals/admintra', body);
		} catch (error) {
			console.log('Error createRental: ', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	return { createRental, loading };
};

export default useCreateRental;