import { del } from '@/utils/request';
import { useCallback, useState } from 'react';

const useDeleteRoom = () => {
    const [loading, setLoading] = useState(false);

    const deleteRoom = useCallback(async (id: string): Promise<any> => {
        setLoading(true);
        try {
            return await del(`/rooms/${id}`);
        } catch (error) {
            console.error('Error deleteRoom:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteRoom, loading };
};

export default useDeleteRoom;