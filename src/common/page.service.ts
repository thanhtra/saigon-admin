import { RentalType, UploadDomain } from "@/common/enum";
import { formatVnd } from "@/common/service";
import { NormalizedUploadPreview, UploadPreview } from "@/types";

type RoomLite = {
    price?: number | string;
    active?: boolean;
};

type RentalLite = {
    rental_type: RentalType;
    rooms?: RoomLite[];
};


export const resolveRentalPrice = (
    rental?: RentalLite,
): number[] | null => {
    if (!rental?.rooms?.length) return null;

    const rooms = rental.rooms;

    /* ===== KHÔNG PHẢI DÃY TRỌ ===== */
    if (rental.rental_type !== RentalType.BoardingHouse) {
        const room =
            rooms.find(r => r.active && r.price) ||
            rooms.find(r => r.price);

        if (!room?.price) return null;

        const price = Number(room.price);
        return isNaN(price) ? null : [price];
    }

    /* ===== DÃY TRỌ ===== */
    const prices = rooms
        .filter(r => r.active && r.price)
        .map(r => Number(r.price))
        .filter(p => !isNaN(p))
        .sort((a, b) => a - b);

    if (!prices.length) return null;

    return prices;
};


export const formatPriceRange = (
    prices?: number[] | null,
): string => {
    if (!prices?.length) return 'Đang cập nhật';

    return prices.map(p => formatVnd(p)).join(' - ');
};


export const normalizeImagesPayload = async ({
    images,
    uploadImages,
    roomId,
    originalUploadIds,
}: {
    images: UploadPreview[];
    uploadImages: (
        files: { file: File; is_cover?: boolean }[],
        options: any,
    ) => Promise<any>;
    roomId: string;
    originalUploadIds: string[];
}) => {
    /* ===== 1. Chuẩn hoá cover (luôn có 1 cover) ===== */
    const coverIndex = images.findIndex(i => i.isCover);

    const normalizedImages = images.map((img, index) => ({
        ...img,
        isCover: coverIndex >= 0 ? index === coverIndex : index === 0,
    }));

    /* ===== 2. Upload ảnh mới ===== */
    const newImages = normalizedImages.filter(
        (i): i is NormalizedUploadPreview & { file: File; client_id: string } =>
            i.file instanceof File && typeof i.client_id === 'string',
    );

    const uploadedMap = new Map<string, string>();

    if (newImages.length) {
        const uploadRes = await uploadImages(
            newImages.map(i => ({
                file: i.file,
                is_cover: !!i.isCover,
            })),
            {
                domain: UploadDomain.Rooms,
                room_id: roomId,
            },
        );

        if (!uploadRes?.success) {
            throw new Error('Upload failed');
        }

        uploadRes.result.forEach((u: any, idx: number) => {
            uploadedMap.set(newImages[idx].client_id, u.id);
        });
    }

    /* ===== 3. Build upload_ids theo thứ tự UI ===== */
    const upload_ids = normalizedImages
        .map(img => {
            if (img.id) return img.id;
            if (img.client_id) return uploadedMap.get(img.client_id);
            return undefined;
        })
        .filter((id): id is string => Boolean(id));

    /* ===== 4. delete_upload_ids ===== */
    const delete_upload_ids = originalUploadIds.filter(
        id => !upload_ids.includes(id),
    );

    /* ===== 5. cover_upload_id ===== */
    const cover = normalizedImages.find(i => i.isCover);

    const cover_upload_id =
        cover?.id ??
        (cover?.client_id
            ? uploadedMap.get(cover.client_id)
            : undefined);


    return {
        upload_ids,
        delete_upload_ids,
        cover_upload_id
    };
};


export const normalizeLandImagesPayload = async ({
    images,
    uploadImages,
    landId,
    originalUploadIds,
}: {
    images: UploadPreview[];
    uploadImages: (
        files: { file: File; is_cover?: boolean }[],
        options: any,
    ) => Promise<any>;
    landId: string;
    originalUploadIds: string[];
}) => {
    /* ===== 1. Chuẩn hoá cover ===== */
    const coverIndex = images.findIndex(i => i.isCover);

    const normalizedImages = images.map((img, index) => ({
        ...img,
        isCover: coverIndex >= 0 ? index === coverIndex : index === 0,
    }));

    /* ===== 2. Upload ảnh mới ===== */
    const newImages = normalizedImages.filter(
        (i): i is NormalizedUploadPreview & {
            file: File;
            client_id: string;
        } =>
            i.file instanceof File &&
            typeof i.client_id === 'string',
    );

    const uploadedMap = new Map<string, string>();

    if (newImages.length) {
        const uploadRes = await uploadImages(
            newImages.map(i => ({
                file: i.file,
                is_cover: !!i.isCover,
            })),
            {
                domain: UploadDomain.Lands,
                land_id: landId,
            },
        );

        if (!uploadRes?.success) {
            throw new Error('Upload land images failed');
        }

        uploadRes.result.forEach((u: any, idx: number) => {
            uploadedMap.set(newImages[idx].client_id, u.id);
        });
    }

    /* ===== 3. upload_ids ===== */
    const upload_ids = normalizedImages
        .map(img => {
            if (img.id) return img.id;
            if (img.client_id) return uploadedMap.get(img.client_id);
            return undefined;
        })
        .filter((id): id is string => Boolean(id));

    /* ===== 4. delete_upload_ids ===== */
    const delete_upload_ids = originalUploadIds.filter(
        id => !upload_ids.includes(id),
    );

    /* ===== 5. cover_upload_id ===== */
    const cover = normalizedImages.find(i => i.isCover);

    const cover_upload_id =
        cover?.id ??
        (cover?.client_id
            ? uploadedMap.get(cover.client_id)
            : undefined);

    return {
        upload_ids,
        delete_upload_ids,
        cover_upload_id,
    };
};
