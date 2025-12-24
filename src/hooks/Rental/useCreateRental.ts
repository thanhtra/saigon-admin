import { RentalInput } from '@/common/type';
import { post } from '@/utils/request';
import { useCallback, useState } from 'react';


const useCreateRental = () => {
	const [loading, setLoading] = useState(false);

	const createRental = useCallback(async (body: RentalInput): Promise<any> => {
		setLoading(true);
		try {
			return await post('/rentals', body);
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