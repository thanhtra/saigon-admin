import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

export type Params = {
    page?: number;
    size?: number;
    keySearch?: string;
    isPagin?: boolean;
    profession?: string;
};

const useGetUsers = () => {
    const [loading, setLoading] = useState(false);

    const getUsers = useCallback(async (params?: Params) => {
        setLoading(true);
        try {
            return await get('/users', params);
        } catch (error) {
            console.error('Error getUsers:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getUsers, loading };
};

export default useGetUsers;

