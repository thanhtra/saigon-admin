import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

export type Params = {
    page?: number;
    size?: number;
    keySearch?: string;
    isPagin?: boolean;
    profession?: string;
};

const useGetRooms = () => {
    const [loading, setLoading] = useState(false);

    const getRooms = useCallback(async (params?: Params) => {
        setLoading(true);
        try {
            return await get('/rooms', params);
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

