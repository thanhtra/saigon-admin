import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

const useGetCollaboratorDetail = () => {
    const [loading, setLoading] = useState(false);

    const getCollaboratorDetail = useCallback(async (id: string): Promise<any> => {
        setLoading(true);
        try {
            return await get(`/collaborators/${id}/admintra`);
        } catch (error) {
            console.log('Error getCollaboratorDetail: ', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getCollaboratorDetail, loading };
};

export default useGetCollaboratorDetail;