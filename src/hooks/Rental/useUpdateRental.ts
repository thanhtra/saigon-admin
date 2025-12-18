// hooks/Rental/useUpdateRental.ts
import { put } from '@/utils/request';
import { Rental } from '@/types/rental';
import { useCallback, useState } from 'react';

const useUpdateRental = () => {
    const [loading, setLoading] = useState(false);

    const updateRental = useCallback(async (id: string, body: Rental) => {
        setLoading(true);
        try {
            return await put(`/rentals/${id}`, body);
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateRental, loading };
};

export default useUpdateRental;
