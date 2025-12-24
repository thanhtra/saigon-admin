import { RentalInput } from '@/common/type';
import { put } from '@/utils/request';
import { useCallback, useState } from 'react';

const useUpdateRental = () => {
    const [loading, setLoading] = useState(false);

    const updateRental = useCallback(async (id: string, body: RentalInput): Promise<any> => {
        setLoading(true);
        try {
            return await put(`/rentals/${id}`, body);
        } catch (error) {
            console.log('Error updateRental: ', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateRental, loading };
};

export default useUpdateRental;