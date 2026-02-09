import { LandType } from '@/common/enum';
import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

export type Params = {
    page?: number;
    size?: number;
    is_pagin?: boolean;
    key_search?: string;
    land_type?: LandType;
    collaborator_id?: string;
    active?: boolean;
};

const useGetLands = () => {
    const [loading, setLoading] = useState(false);

    const getLands = useCallback(async (params?: Params) => {
        setLoading(true);
        try {
            return await get('/lands/admintra', params);
        } catch (error) {
            console.error('Error getLands:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getLands, loading };
};

export default useGetLands;

