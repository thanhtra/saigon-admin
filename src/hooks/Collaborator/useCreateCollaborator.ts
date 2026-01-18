import { CollaboratorTypeForm } from '@/types';
import { post } from '@/utils/request';
import { useCallback, useState } from 'react';


const useCreateCollaborator = () => {
	const [loading, setLoading] = useState(false);

	const createCollaborator = useCallback(async (body: CollaboratorTypeForm): Promise<any> => {
		setLoading(true);
		try {
			return await post('/collaborators/admintra', body);
		} catch (error) {
			console.log('Error createCollaborator: ', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	return { createCollaborator, loading };
};

export default useCreateCollaborator;