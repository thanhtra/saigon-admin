import { get } from '@/utils/apiClient';
import { useCallback } from 'react';

const useGetTopicIdsByCategory = () => {
    const fetchTopicIds = useCallback(async (categoryId: string) => {
        try {
            const res = await get(`/affiliate-category/topic-mapping/${categoryId}`);
            console.log('ahiiii', res);
            if (res?.success) {
                return res?.result || [];
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching topic ids by category:', error);
            throw error;
        }
    }, []);

    return { fetchTopicIds };
};

export default useGetTopicIdsByCategory;
