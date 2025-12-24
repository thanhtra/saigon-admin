import { Tenant } from '@/common/type';
import { post } from '@/utils/request';
import { useCallback, useState } from 'react';


const useCreateTenant = () => {
	const [loading, setLoading] = useState(false);

	const createTenant = useCallback(async (body: Tenant): Promise<any> => {
		setLoading(true);
		try {
			return await post('/tenants', body);
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