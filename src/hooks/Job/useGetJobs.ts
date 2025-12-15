import { get } from '@/utils/apiClient';
import { useCallback } from 'react';


const useGetCronJobs = () => {
    const getCronJobs = useCallback(async () => {
        try {
            const data = await get('/manage-post', {});
            return data;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    }, []);

    return { getCronJobs };
};

export default useGetCronJobs;
