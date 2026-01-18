export enum RoomErrorCode {
    RENTAL_NOT_CONFIRMED = 'ROOM_RENTAL_NOT_CONFIRMED',
}

export const RoomErrorMessage: Record<RoomErrorCode, string> = {
    [RoomErrorCode.RENTAL_NOT_CONFIRMED]: 'Nhà chưa được xác nhận hoa hồng, không thể mở phòng để cho thuê',
};

export const getErrorMessage = (errorCode: string) => {
    if (!errorCode) return '';

    return RoomErrorMessage[errorCode as RoomErrorCode] || '';
}
