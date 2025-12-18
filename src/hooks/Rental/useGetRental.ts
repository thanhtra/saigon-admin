import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

export type GetRentalsParams = {
    page?: number;
    size?: number;
    keySearch?: string;
    isPagin?: boolean;
    profession?: string;
};

const useGetRentals = () => {
    const [loading, setLoading] = useState(false);

    const getRentals = useCallback(async (params?: GetRentalsParams) => {
        setLoading(true);
        try {
            const res = await get('/rentals', params);
            return res;
        } catch (error) {
            console.error('Get rentals error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        getRentals,
        loading,
    };
};

export default useGetRentals;
