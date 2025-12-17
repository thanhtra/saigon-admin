import { post } from '@/utils/request';
import { useCallback } from 'react';

export interface ProductTiktok {
    link: string;
    title: string;
}

const useCreateProductTiktok = () => {
    const createProductTiktok = useCallback(async (category: string, products: ProductTiktok[]) => {
        try {
            const res = await post('/product-tiktok', { category, products });
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    return { createProductTiktok };
};

export default useCreateProductTiktok;