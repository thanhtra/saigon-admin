import { RentalType, RoomStatus } from '@/common/enum';
import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

export type Params = {
    page?: number;
    size?: number;
    key_search?: string;
    is_pagin?: boolean;
    rental_type?: RentalType;
    rental_id?: string;
    status?: RoomStatus;
    ctv_collaborator_id?: string;
};

const useGetRooms = () => {
    const [loading, setLoading] = useState(false);

    const getRooms = useCallback(async (params?: Params) => {
        setLoading(true);
        try {
            return await get('/rooms/admintra', params);
        } catch (error) {
            console.error('Error getRooms:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getRooms, loading };
};

export default useGetRooms;

