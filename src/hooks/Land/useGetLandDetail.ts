import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

const useGetLandDetail = () => {
    const [loading, setLoading] = useState(false);

    const getLandDetail = useCallback(async (id: string): Promise<any> => {
        setLoading(true);

        try {
            return await get(`/lands/${id}/admintra`);
        } catch (error) {
            console.log('Error getLandDetail: ', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getLandDetail, loading };
};

export default useGetLandDetail;