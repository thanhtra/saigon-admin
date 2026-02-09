import { LandForm } from '@/types';
import { put } from '@/utils/request';
import { useCallback, useState } from 'react';

const useUpdateLand = () => {
    const [loading, setLoading] = useState(false);

    const updateLand = useCallback(async (id: string, body: Partial<LandForm>): Promise<any> => {
        setLoading(true);
        try {
            return await put(`/lands/${id}/admintra`, body);
        } catch (error) {
            console.log('Error updateLand: ', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateLand, loading };
};

export default useUpdateLand;