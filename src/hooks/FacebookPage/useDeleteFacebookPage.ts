import { del } from '@/utils/apiClient';
import { useCallback } from 'react';

const useDeleteFacebookPage = () => {
    const deleteFacebookPage = useCallback(async (id: string) => {
        try {
            const res = await del(`/facebook-page/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting Facebook page:', error);
            throw error;
        }
    }, []);

    return { deleteFacebookPage };
};

export default useDeleteFacebookPage;
