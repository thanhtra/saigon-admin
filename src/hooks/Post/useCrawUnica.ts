import { post } from '@/utils/apiClient';
import { useCallback } from 'react';

export type CrawUnica = {
    social: string,
    url: string,
    title?: string,
    footer?: string,
    active?: boolean,
    topic_id?: string,
    collaborator_id?: string
}

const useCrawUnica = () => {
    const crawUnica = useCallback(async (data: CrawUnica) => {
        try {
            const res = await post('/posts/crawl-unica', data);
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { crawUnica };
};

export default useCrawUnica;
