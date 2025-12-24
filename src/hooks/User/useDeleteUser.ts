import { del } from '@/utils/request';
import { useCallback, useState } from 'react';

const useDeleteUser = () => {
    const [loading, setLoading] = useState(false);

    const deleteUser = useCallback(async (id: string): Promise<any> => {
        setLoading(true);
        try {
            return await del(`/users/${id}`);
        } catch (error) {
            console.error('Error deleteUser:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteUser, loading };
};

export default useDeleteUser;