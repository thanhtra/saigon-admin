import { del } from '@/utils/request';
import { useCallback, useState } from 'react';

const useDeleteRental = () => {
    const [loading, setLoading] = useState(false);

    const deleteRental = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const res = await del(`/rentals/${id}`);
            return res;
        } catch (error) {
            console.error('Delete rental error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        deleteRental,
        loading,
    };
};

export default useDeleteRental;
