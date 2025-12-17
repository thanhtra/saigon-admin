import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

export type GetUsersParams = {
    page?: number;
    size?: number;
    keySearch?: string;
    isPagin?: boolean;
    profession?: string;
};

const useGetUsers = () => {
    const [loading, setLoading] = useState(false);

    const getUsers = useCallback(async (params?: GetUsersParams) => {
        setLoading(true);
        try {
            const res = await get('/users', params);
            return res;
        } catch (error) {
            console.error('Get users error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        getUsers,
        loading,
    };
};

export default useGetUsers;
