import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

const useGetRoomDetail = () => {
    const [loading, setLoading] = useState(false);

    const getRoomDetail = useCallback(async (id: string): Promise<any> => {
        setLoading(true);
        try {
            return await get(`/rooms/${id}/admintra`);
        } catch (error) {
            console.log('Error getRoomDetail: ', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getRoomDetail, loading };
};

export default useGetRoomDetail;