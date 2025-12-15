import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

const useGetCategoryIdsByTopic = () => {
    const fetchCategoryIds = useCallback(async (topicId: string): Promise<string[]> => {
        try {
            const res = await get(`/affiliate-category/category-mapping/${topicId}`);
            if (res?.success) {
                return res.result;
            }
            return [];
        } catch (error) {
            console.error('Error fetching category IDs by topic:', error);
            return [];
        }
    }, []);

    return { fetchCategoryIds };
};

export default useGetCategoryIdsByTopic;
