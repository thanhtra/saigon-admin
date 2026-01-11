import { RentalType, UploadDomain } from "@/common/enum";
import { formatVnd } from "@/common/service";
import { UploadPreview } from "@/common/type";

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
    uploadImages: (files: File[], meta: any) => Promise<any>;
    roomId: string;
    originalUploadIds: string[];
}) => {
    /* ===== 1. Upload ảnh mới ===== */
    const newImages = images.filter(i => i.file && i.client_id);
    const uploadedMap = new Map<string, string>();

    if (newImages.length) {
        const uploadRes = await uploadImages(
            newImages.map(i => i.file!),
            { domain: UploadDomain.Rooms, room_id: roomId },
        );

        if (!uploadRes?.success) {
            throw new Error('Upload failed');
        }

        uploadRes.result.forEach((u: any, idx: number) => {
            uploadedMap.set(newImages[idx].client_id!, u.id);
        });
    }

    /* ===== 2. build upload_ids theo thứ tự UI ===== */
    const upload_ids = images
        .map(img => {
            if (img.id) return img.id;
            if (img.client_id) return uploadedMap.get(img.client_id);
            return undefined;
        })
        .filter((id): id is string => Boolean(id));

    /* ===== 3. cover_index ===== */
    let cover_index = images.findIndex(i => i.isCover);
    if (cover_index < 0) cover_index = 0;

    /* ===== 4. delete_upload_ids (QUAN TRỌNG) ===== */
    const delete_upload_ids = originalUploadIds.filter(
        id => !upload_ids.includes(id),
    );

    return {
        upload_ids,
        cover_index,
        delete_upload_ids,
    };
};
