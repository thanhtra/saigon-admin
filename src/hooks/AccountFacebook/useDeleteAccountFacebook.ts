import { del } from '@/utils/request';
import { useCallback } from 'react';

const useDeleteAccountFacebook = () => {
    const deleteAccountFacebook = useCallback(async (id: string) => {
        try {
            const res = await del(`/account-facebook/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting:', error);
            throw error;
        }
    }, []);

    return { deleteAccountFacebook };
};

export default useDeleteAccountFacebook;
