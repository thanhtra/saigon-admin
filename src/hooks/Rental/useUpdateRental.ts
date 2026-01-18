import { RentalForm } from '@/types';
import { put } from '@/utils/request';
import { useCallback, useState } from 'react';

const useUpdateRental = () => {
    const [loading, setLoading] = useState(false);

    const updateRental = useCallback(async (id: string, body: Partial<RentalForm>): Promise<any> => {
        setLoading(true);
        try {
            return await put(`/rentals/${id}/admintra`, body);
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