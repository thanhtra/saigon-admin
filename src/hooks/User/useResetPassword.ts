import { post } from '@/utils/request';
import { useCallback, useState } from 'react';

const useResetPassword = () => {
	const [loading, setLoading] = useState(false);

	const resetPassword = useCallback(async (userId: string): Promise<any> => {
		setLoading(true);
		try {
			return await post(`/auth/${userId}/reset-password`, {});
		} catch (error) {
			console.error('Error resetPassword: ', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	return { resetPassword, loading };
};

export default useResetPassword;
