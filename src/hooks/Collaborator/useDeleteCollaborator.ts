import { del } from '@/utils/request';
import { useCallback, useState } from 'react';

const useDeleteCollaborator = () => {
    const [loading, setLoading] = useState(false);

    const deleteCollaborator = useCallback(async (id: string): Promise<any> => {
        setLoading(true);
        try {
            return await del(`/collaborators/${id}/admintra`);
        } catch (error) {
            console.error('Error deleteCollaborator:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteCollaborator, loading };
};

export default useDeleteCollaborator;