import { RoomForm } from '@/types';
import { post } from '@/utils/request';
import { useCallback, useState } from 'react';


const useCreateRoom = () => {
	const [loading, setLoading] = useState(false);

	const createRoom = useCallback(async (body: RoomForm): Promise<any> => {
		setLoading(true);
		try {
			return await post('/rooms/admintra', body);
		} catch (error) {
			console.log('Error createRoom: ', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	return { createRoom, loading };
};

export default useCreateRoom;