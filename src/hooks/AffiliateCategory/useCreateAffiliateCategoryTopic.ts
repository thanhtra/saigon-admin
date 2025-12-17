import { post } from '@/utils/request';
import { AffiliateCategoryTopicInput } from '@/utils/type';
import { useCallback } from 'react';

const useCreateAffiliateCategoryTopic = () => {
    const createAffiliateCategoryTopic = useCallback(
        async (body: AffiliateCategoryTopicInput) => {
            try {
                const res = await post('/affiliate-category/category-mapping', body);
                return res;
            } catch (error) {
                console.error('Error creating mapping:', error);
                throw error;
            }
        },
        []
    );

    return { createAffiliateCategoryTopic };
};

export default useCreateAffiliateCategoryTopic;
