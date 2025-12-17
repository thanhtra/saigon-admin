import { post } from '@/utils/request';
import { useCallback } from 'react';

export type CreatePostDto = {
    social: string,
    title?: string,
    descriptions: string[],
    footer?: string,
    active?: boolean,
    topic_id?: string,
    collaborator_id?: string
    has_file?: boolean
}

const useCreatePost = () => {
    const createPost = useCallback(async (data: CreatePostDto) => {
        try {
            const res = await post('/posts', data);
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { createPost };
};

export default useCreatePost;
