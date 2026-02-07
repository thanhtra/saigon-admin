import { CollaboratorType, FieldCooperation } from '@/common/enum';
import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

export type ParamsGetAvailableCollaborators = {
    type?: CollaboratorType;
    field_cooperation?: FieldCooperation;
    keyword?: string;
};

const useGetCollaboratorsCtv = () => {
    const [loading, setLoading] = useState(false);

    const getCollaboratorsCtv = useCallback(async (params?: ParamsGetAvailableCollaborators) => {
        setLoading(true);
        try {
            return await get('/collaborators/ctv/admintra', params);
        } catch (error) {
            console.error('Error getCollaboratorsCtv:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getCollaboratorsCtv, loading };
};

export default useGetCollaboratorsCtv;