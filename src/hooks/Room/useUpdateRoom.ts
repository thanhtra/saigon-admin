import { RoomForm } from '@/types';
import { put } from '@/utils/request';
import { useCallback, useState } from 'react';

const useUpdateRoom = () => {
    const [loading, setLoading] = useState(false);

    const updateRoom = useCallback(async (id: string, body: Partial<RoomForm>): Promise<any> => {
        setLoading(true);
        try {
            return await put(`/rooms/${id}/admintra`, body);
        } catch (error) {
            console.log('Error updateRoom: ', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateRoom, loading };
};

export default useUpdateRoom;