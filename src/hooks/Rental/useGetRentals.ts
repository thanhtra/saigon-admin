import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

export type Params = {
    page?: number;
    size?: number;
    keySearch?: string;
    isPagin?: boolean;
    profession?: string;
    active?: boolean;
};

const useGetRentals = () => {
    const [loading, setLoading] = useState(false);

    const getRentals = useCallback(async (params?: Params) => {
        setLoading(true);
        try {
            return await get('/rentals', params);
        } catch (error) {
            console.error('Error getRentals:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getRentals, loading };
};

export default useGetRentals;

