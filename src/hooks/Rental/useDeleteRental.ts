import { del } from '@/utils/request';
import { useCallback, useState } from 'react';

const useDeleteRental = () => {
    const [loading, setLoading] = useState(false);

    const deleteRental = useCallback(async (id: string): Promise<any> => {
        setLoading(true);
        try {
            return await del(`/rentals/${id}/force/admintra`);
        } catch (error) {
            console.error('Error deleteRental:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteRental, loading };
};

export default useDeleteRental;