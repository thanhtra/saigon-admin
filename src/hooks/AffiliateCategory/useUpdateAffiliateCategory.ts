import { put } from '@/utils/apiClient';
import { AffiliateCategoryInput } from '@/utils/type';
import { useCallback } from 'react';

const useUpdateAffiliateCategory = () => {
    const updateAffiliateCategory = useCallback(
        async (id: string, data: AffiliateCategoryInput) => {
            try {
                const res = await put(`/affiliate-category/${id}`, data);
                return res;
            } catch (error) {
                console.error('Error updating affiliate category:', error);
                throw error;
            }
        },
        []
    );

    return { updateAffiliateCategory };
};

export default useUpdateAffiliateCategory;
