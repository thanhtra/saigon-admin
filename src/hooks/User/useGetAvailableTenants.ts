import { get } from '@/utils/request';
import { useCallback, useState } from 'react';

export type GetAvailableTenantsParams = {
    keyword?: string;
    limit?: number;
};


const useGetAvailableTenants = () => {
    const [loading, setLoading] = useState(false);

    const getAvailableTenants = useCallback(
        async (
            params?: GetAvailableTenantsParams,
        ): Promise<any> => {
            setLoading(true);
            try {
                return await get('/users/available-tenant', params);
            } catch (error) {
                console.error('Error getAvailableTenants:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return {
        getAvailableTenants,
        loading,
    };
};

export default useGetAvailableTenants;
