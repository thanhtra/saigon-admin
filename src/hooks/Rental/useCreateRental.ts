import { Rental } from '@/types/rental';
import { post } from '@/utils/request';
import { useCallback, useState } from 'react';

interface CreateRentalResponse {
	success: boolean;
	message?: string;
	data?: Rental;
}

const useCreateRental = () => {
	const [loading, setLoading] = useState(false);

	const createRental = useCallback(
		async (body: Rental): Promise<CreateRentalResponse> => {
			setLoading(true);
			try {
				return await post('/rentals', body);
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		createRental,
		loading,
	};
};

export default useCreateRental;
