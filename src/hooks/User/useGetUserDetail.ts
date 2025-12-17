// hooks/User/useGetUserDetail.ts
import { get } from '@/utils/request';
import { useCallback } from 'react';

const useGetUserDetail = () => {
    const getUserDetail = useCallback(async (id: string) => {
        return await get(`/users/${id}`);
    }, []);

    return { getUserDetail };
};

export default useGetUserDetail;
