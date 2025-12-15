import { del } from '@/utils/apiClient';
import { useCallback } from 'react';

const useDeletePost = () => {
    const deletePost = useCallback(async (id: string) => {
        try {
            const res = await del(`/posts/${id}`);
            return res;
        } catch (error) {
            console.error('Error deleting:', error);
            throw error;
        }
    }, []);

    return { deletePost };
};

export default useDeletePost;
