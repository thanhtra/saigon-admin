import { del } from '@/utils/request';
import { useCallback, useState } from 'react';

const useDeleteTenant = () => {
    const [loading, setLoading] = useState(false);

    const deleteTenant = useCallback(async (id: string): Promise<any> => {
        setLoading(true);
        try {
            return await del(`/tenants/${id}/admintra`);
        } catch (error) {
            console.error('Error deleteTenant:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteTenant, loading };
};

export default useDeleteTenant;