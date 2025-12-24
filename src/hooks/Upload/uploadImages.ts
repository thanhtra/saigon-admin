import { useState, useCallback } from 'react';
import { post } from '@/utils/request';

const useUploadImages = () => {
    const [loading, setLoading] = useState(false);

    const uploadImages = useCallback(
        async (files: File[]): Promise<any> => {
            setLoading(true);
            try {
                const formData = new FormData();
                files.forEach(file => formData.append('files', file));

                return await post('/uploads/multiple', formData);
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return { uploadImages, loading };
};

export default useUploadImages;
