import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

const useGetTenantDetail = () => {
    const [loading, setLoading] = useState(false);

    const getTenantDetail = useCallback(async (id: string): Promise<any> => {
        setLoading(true);
        try {
            return await get(`/tenants/${id}`);
        } catch (error) {
            console.log('Error getTenantDetail: ', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getTenantDetail, loading };
};

export default useGetTenantDetail;