// hooks/Rental/useGetRentalDetail.ts
import { get } from '@/utils/request';
import { useCallback } from 'react';

const useGetRentalDetail = () => {
    const getRentalDetail = useCallback(async (id: string) => {
        return await get(`/rentals/${id}`);
    }, []);

    return { getRentalDetail };
};

export default useGetRentalDetail;
