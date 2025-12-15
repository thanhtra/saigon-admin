import { del } from '@/utils/apiClient';
import { useCallback } from 'react';

const useDeleteAccountLinkedIn = () => {
    const deleteAccountLinkedIn = useCallback(async (id: string) => {
        try {
            const res = await del(`/linkedin-account/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting:', error);
            throw error;
        }
    }, []);

    return { deleteAccountLinkedIn };
};

export default useDeleteAccountLinkedIn;
