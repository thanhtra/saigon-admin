import { LandForm } from '@/types';
import { post } from '@/utils/request';
import { useCallback, useState } from 'react';


const useCreateLand = () => {
	const [loading, setLoading] = useState(false);

	const createLand = useCallback(async (body: LandForm): Promise<any> => {
		setLoading(true);
		try {
			return await post('/lands/admintra', body);
		} catch (error) {
			console.log('Error createLand: ', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	return { createLand, loading };
};

export default useCreateLand;