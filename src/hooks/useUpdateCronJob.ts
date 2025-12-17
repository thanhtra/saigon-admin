import { put } from '@/utils/request';
import { CronJobUpdate } from '@/utils/type';
import { useCallback } from 'react';

const useUpdateCronJob = () => {
    const updateCronJob = useCallback(async (id: string, body: CronJobUpdate) => {
        try {
            const updated = await put(`/manage-post/${id}`, body);
            return updated;
        } catch (error) {
            console.error('Error updating CronJob:', error);
            throw error;
        }
    }, []);

    return { updateCronJob };
};

export default useUpdateCronJob;
