import { del } from '@/utils/request';
import { useCallback, useState } from 'react';

const useDeleteUser = () => {
    const [loading, setLoading] = useState(false);

    const deleteUser = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const res = await del(`/users/${id}`);
            return res;
        } catch (error) {
            console.error('Delete user error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        deleteUser,
        loading,
    };
};

export default useDeleteUser;
