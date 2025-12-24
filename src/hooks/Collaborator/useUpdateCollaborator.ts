import { CollaboratorInput } from '@/common/type';
import { put } from '@/utils/request';
import { useCallback, useState } from 'react';

const useUpdateCollaborator = () => {
    const [loading, setLoading] = useState(false);

    const updateCollaborator = useCallback(async (id: string, body: CollaboratorInput): Promise<any> => {
        setLoading(true);
        try {
            return await put(`/collaborators/${id}`, body);
        } catch (error) {
            console.log('Error updateCollaborator: ', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateCollaborator, loading };
};

export default useUpdateCollaborator;