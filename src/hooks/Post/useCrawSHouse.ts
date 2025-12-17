import { post } from '@/utils/request';
import { useCallback } from 'react';

export type CrawSHouse = {
    social: string,
    title?: string,
    footer?: string,
    active?: boolean,
    topic_id?: string,
    collaborator_id?: string
}

const useCrawSHouse = () => {
    const crawSHouse = useCallback(async (data: CrawSHouse) => {
        try {
            const res = await post('/posts/crawl-s-house', data);
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { crawSHouse };
};

export default useCrawSHouse;
