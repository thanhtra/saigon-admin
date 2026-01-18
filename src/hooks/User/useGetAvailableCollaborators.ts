import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

export type GetAvailableCollaboratorsParams = {
    keyword?: string;
    limit?: number;
};


const useGetAvailableCollaborators = () => {
    const [loading, setLoading] = useState(false);

    const getAvailableCollaborators = useCallback(
        async (
            params?: GetAvailableCollaboratorsParams,
        ): Promise<any> => {
            setLoading(true);
            try {
                return await get('/users/available-collaborator/admintra', params);
            } catch (error) {
                console.error('Error getAvailableCollaborators:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return {
        getAvailableCollaborators,
        loading,
    };
};

export default useGetAvailableCollaborators;
