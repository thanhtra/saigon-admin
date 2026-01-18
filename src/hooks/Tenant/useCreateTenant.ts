import { TenantInput } from '@/common/type';
import { post } from '@/utils/request';
import { useCallback, useState } from 'react';


const useCreateTenant = () => {
	const [loading, setLoading] = useState(false);

	const createTenant = useCallback(async (body: TenantInput): Promise<any> => {
		setLoading(true);
		try {
			return await post('/tenants/admintra', body);
		} catch (error) {
			console.log('Error createTenant: ', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	return { createTenant, loading };
};

export default useCreateTenant;