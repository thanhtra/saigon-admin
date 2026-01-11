import { TenantInput } from '@/common/type';
import { put } from '@/utils/request';
import { useCallback, useState } from 'react';

const useUpdateTenant = () => {
    const [loading, setLoading] = useState(false);

    const updateTenant = useCallback(async (id: string, body: TenantInput): Promise<any> => {
        setLoading(true);
        try {
            return await put(`/tenants/${id}`, body);
        } catch (error) {
            console.log('Error updateTenant: ', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateTenant, loading };
};

export default useUpdateTenant;