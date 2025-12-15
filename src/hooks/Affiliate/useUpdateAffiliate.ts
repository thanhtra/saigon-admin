import { put } from '@/utils/apiClient';
import { AffiliateInput } from '@/utils/type';
import { useCallback } from 'react';

const useUpdateAffiliate = () => {
    const updateAffiliate = useCallback(async (id: string, body: AffiliateInput) => {
        try {
            const updated = await put(`/affiliate/${id}`, body);
            return updated;
        } catch (error) {
            console.error('Error updating Affiliate:', error);
            throw error;
        }
    }, []);

    return { updateAffiliate };
};

export default useUpdateAffiliate;