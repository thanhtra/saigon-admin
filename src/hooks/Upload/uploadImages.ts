import { UploadImagesOptions, UploadResponse } from '@/types';
import { post } from '@/utils/request';
import { useCallback, useState } from 'react';

type UploadFileItem = {
    file: File;
    is_cover?: boolean;
};

const useUploadImages = () => {
    const [loading, setLoading] = useState(false);

    const uploadImages = useCallback(
        async (
            files: UploadFileItem[],
            options: UploadImagesOptions,
        ): Promise<UploadResponse> => {
            setLoading(true);

            try {
                if (!files || !files.length) {
                    throw new Error('No files to upload');
                }

                if (!options?.domain) {
                    throw new Error('Upload domain is required');
                }

                const formData = new FormData();

                /* ===== REQUIRED ===== */
                formData.append('domain', options.domain);

                /* ===== OPTIONAL IDS ===== */
                if ('room_id' in options && options.room_id) {
                    formData.append('room_id', options.room_id);
                }

                if ('real_estate_id' in options && options.real_estate_id) {
                    formData.append('real_estate_id', options.real_estate_id);
                }

                if ('contract_id' in options && options.contract_id) {
                    formData.append('contract_id', options.contract_id);
                }

                /* ===== FILES + COVER FLAG ===== */
                files.forEach((item, index) => {
                    if (item?.file instanceof File) {
                        formData.append('files', item.file);
                        formData.append(
                            `is_cover[${index}]`,
                            String(!!item.is_cover),
                        );
                    }
                });

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
