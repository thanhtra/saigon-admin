import { CollaboratorType, FieldCooperation } from '@/common/enum';
import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

export type ParamsGetAvailableCollaborators = {
    type?: CollaboratorType;
    field_cooperation?: FieldCooperation;
    keyword?: string;
};

const useGetCollaboratorsAvailable = () => {
    const [loading, setLoading] = useState(false);

    const getCollaboratorsAvailable = useCallback(async (params?: ParamsGetAvailableCollaborators) => {
        setLoading(true);
        try {
            return await get('/collaborators/available/admintra', params);
        } catch (error) {
            console.error('Error getCollaboratorsAvailable:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getCollaboratorsAvailable, loading };
};

export default useGetCollaboratorsAvailable;