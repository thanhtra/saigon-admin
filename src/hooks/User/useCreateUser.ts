import { User } from '@/common/type';
import { post } from '@/utils/request';
import { useCallback, useState } from 'react';


const useCreateUser = () => {
	const [loading, setLoading] = useState(false);

	const createUser = useCallback(async (body: User): Promise<any> => {
		setLoading(true);
		try {
			return await post('/users/admintra', body);
		} catch (error) {
			console.log('Error createUser: ', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	return { createUser, loading };
};

export default useCreateUser;