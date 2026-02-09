import { del } from '@/utils/request';
import { useCallback, useState } from 'react';

const useDeleteLand = () => {
    const [loading, setLoading] = useState(false);

    const deleteLand = useCallback(async (id: string): Promise<any> => {
        setLoading(true);

        try {
            return await del(`/lands/${id}/admintra`);
        } catch (error) {
            console.error('Error deleteLand:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteLand, loading };
};

export default useDeleteLand;