import { RoomInput } from '@/common/type';
import { put } from '@/utils/request';
import { useCallback, useState } from 'react';

const useUpdateRoom = () => {
    const [loading, setLoading] = useState(false);

    const updateRoom = useCallback(async (id: string, body: RoomInput): Promise<any> => {
        setLoading(true);
        try {
            return await put(`/rooms/${id}`, body);
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