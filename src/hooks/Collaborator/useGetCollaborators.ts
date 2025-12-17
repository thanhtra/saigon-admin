import { get } from '@/utils/request';
import { useCallback } from 'react';

type Params = {
    page?: number;
    size?: number;
    keySearch?: string;
    isPagin?: boolean;
    profession?: string
};

const useGetCollaborators = () => {
    const getCollaborators = useCallback(async (params?: Params) => {
        try {
            const data = await get('/collaborator', params);
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }, []);

    return { getCollaborators };
};

export default useGetCollaborators;
