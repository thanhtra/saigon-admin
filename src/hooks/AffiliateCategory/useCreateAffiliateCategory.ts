import { post } from '@/utils/apiClient';
import { AffiliateCategoryInput } from '@/utils/type';

const useCreateAffiliateCategory = () => {
    const createAffiliateCategory = async (input: AffiliateCategoryInput) => {
        try {
            const res = await post('/affiliate-category', input);
            return res;
        } catch (error) {
            console.error('Error creating affiliate category:', error);
            throw error;
        }
    };

    return { createAffiliateCategory };
};

export default useCreateAffiliateCategory;
