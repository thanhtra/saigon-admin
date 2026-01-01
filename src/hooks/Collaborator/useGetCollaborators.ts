import { FieldCooperation } from '@/common/enum';
import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

export type Params = {
    page?: number;
    size?: number;
    key_search?: string;
    is_pagin?: boolean;
    field_cooperation?: FieldCooperation;
};

const useGetCollaborators = () => {
    const [loading, setLoading] = useState(false);

    const getCollaborators = useCallback(async (params?: Params) => {
        setLoading(true);
        try {
            return await get('/collaborators', params);
        } catch (error) {
            console.error('Error getCollaborators:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getCollaborators, loading };
};

export default useGetCollaborators;

