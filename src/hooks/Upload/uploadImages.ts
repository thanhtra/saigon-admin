import { useState, useCallback } from 'react';
import { post } from '@/utils/request';

/* ================= TYPES ================= */

export type FileType = 'image' | 'video';
export type UploadDomain = 'rooms' | 'real-estates' | 'contracts';

interface BaseUploadOptions {
    // file_type: FileType;
    domain: UploadDomain;
}

export interface UploadRoomOptions extends BaseUploadOptions {
    domain: 'rooms';
    room_id: string;
}

export interface UploadRealEstateOptions extends BaseUploadOptions {
    domain: 'real-estates';
    real_estate_id: string;
}

export interface UploadContractOptions extends BaseUploadOptions {
    domain: 'contracts';
    contract_id: string;
}

export type UploadImagesOptions =
    | UploadRoomOptions
    | UploadRealEstateOptions
    | UploadContractOptions;

export interface UploadResult {
    id: string;
    file_url: string;
    // file_type: FileType;
}

export interface UploadResponse {
    success: boolean;
    result: UploadResult[];
    message?: string;
}

/* ================= HOOK ================= */

const useUploadImages = () => {
    const [loading, setLoading] = useState(false);

    const uploadImages = useCallback(
        async (
            files: File[],
            options: UploadImagesOptions,
        ): Promise<UploadResponse> => {
            setLoading(true);
            try {
                if (!files?.length) {
                    throw new Error('No files to upload');
                }

                const formData = new FormData();

                formData.append('domain', options.domain);
                // formData.append('file_type', options.file_type);

                if ('room_id' in options) {
                    formData.append('room_id', options.room_id);
                }
                if ('real_estate_id' in options) {
                    formData.append('real_estate_id', options.real_estate_id);
                }
                if ('contract_id' in options) {
                    formData.append('contract_id', options.contract_id);
                }

                files.forEach(file => {
                    formData.append('files', file);
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
