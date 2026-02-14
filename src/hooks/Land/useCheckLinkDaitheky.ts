import { post } from '@/utils/request';
import { useCallback, useState } from 'react';


const useCheckLinkDaitheky = () => {
	const [loading, setLoading] = useState(false);

	const checkLinkDaitheky = useCallback(async (link: string): Promise<any> => {
		setLoading(true);
		try {
			return await post('/lands/check-link-daitheky/admintra', { link });
		} catch (error) {
			console.log('Error checkLinkDaitheky: ', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	return { checkLinkDaitheky, loading };
};

export default useCheckLinkDaitheky;