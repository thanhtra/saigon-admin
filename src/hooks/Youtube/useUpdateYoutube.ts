// hooks/useUpdateYoutube.ts
import { put } from '@/utils/apiClient';
import { YoutubeInput } from '@/utils/type';
import { useCallback } from 'react';

const useUpdateYoutube = () => {
    const updateYoutube = useCallback(async (id: string, body: YoutubeInput) => {
        try {
            const updated = await put(`/youtube/${id}`, body);
            return updated;
        } catch (error) {
            console.error('Error updating Youtube:', error);
            throw error;
        }
    }, []);

    return { updateYoutube };
};

export default useUpdateYoutube;
