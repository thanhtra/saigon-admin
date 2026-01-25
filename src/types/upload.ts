import { BaseEntity } from './base.type';
import { UploadDomain } from '@/common/enum';
import type { Room } from './room';
import { Contract } from './contract';


export type FileType = 'image' | 'video';
export type Domain = UploadDomain.Rooms | UploadDomain.RealEstates | UploadDomain.Contracts;

interface BaseUploadOptions {
    // file_type: FileType;
    domain: Domain;
}

export interface UploadRoomOptions extends BaseUploadOptions {
    domain: UploadDomain.Rooms;
    room_id: string;
}

export interface UploadRealEstateOptions extends BaseUploadOptions {
    domain: UploadDomain.RealEstates;
    real_estate_id: string;
}

export interface UploadContractOptions extends BaseUploadOptions {
    domain: UploadDomain.Contracts;
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


export type Upload = BaseEntity & {
    file_path: string;
    file_type: FileType;
    domain: UploadDomain;

    /* ===== ROOM ===== */
    room_id?: string | null;
    room?: Room;

    /* ===== REAL ESTATE (nếu dùng) ===== */
    real_estate_id?: string | null;

    /* ===== CONTRACT ===== */
    contract_id?: string | null;
    contract?: Contract;
};

export type UploadLite = Pick<
    Upload,
    'id' | 'file_path' | 'file_type' | 'domain'
>;


export interface UploadPreview {
    id?: string;              // tồn tại nếu là ảnh từ DB
    file?: File;              // tồn tại nếu là ảnh mới
    preview: string;
    isCover?: boolean;
    isExisting?: boolean;     // ⭐ QUAN TRỌNG
    client_id?: string;
}

export type NormalizedUploadPreview = UploadPreview & {
    isCover: boolean;
};
