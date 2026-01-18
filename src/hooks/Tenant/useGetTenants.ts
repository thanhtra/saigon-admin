import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

export type Params = {
    page?: number;
    size?: number;
    key_search?: string;
    is_pagin?: boolean;
    profession?: string;
};

const useGetTenants = () => {
    const [loading, setLoading] = useState(false);

    const getTenants = useCallback(async (params?: Params) => {
        setLoading(true);
        try {
            return await get('/tenants/admintra', params);
        } catch (error) {
            console.error('Error getTenants:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getTenants, loading };
};

export default useGetTenants;

