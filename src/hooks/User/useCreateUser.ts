import { User } from '@/types/user';
import { post } from '@/utils/request';
import { useCallback, useState } from 'react';

interface CreateUserResponse {
	success: boolean;
	message?: string;
	data?: User;
}

const useCreateUser = () => {
	const [loading, setLoading] = useState(false);

	const createUser = useCallback(
		async (body: User): Promise<CreateUserResponse> => {
			setLoading(true);
			try {
				return await post('/users', body);
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		createUser,
		loading,
	};
};

export default useCreateUser;
