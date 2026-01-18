import { BookingStatusLabels, CollaboratorTypeLabels, RentalAmenityOptions, RentalStatusLabels, RentalTypeLabels, RoomStatusLabels } from "./const";
import { createOptionsFromLabels } from "./service";


export const RentalTypeOptions = createOptionsFromLabels(RentalTypeLabels, {
    includeAll: true,
    allLabel: 'Tất cả loại hình',
});

export const RoomStatusOptions = createOptionsFromLabels(RoomStatusLabels, {
    includeAll: true,
    allLabel: 'Tất cả trạng thái',
});

export const RentalStatusOptions = createOptionsFromLabels(RentalStatusLabels, {
    includeAll: true,
    allLabel: 'Tất cả trạng thái nhà',
});

export const BookingStatusOptions = createOptionsFromLabels(BookingStatusLabels);

export const CollaboratorTypeOptions = createOptionsFromLabels(CollaboratorTypeLabels);

export const AmenityOptions = createOptionsFromLabels(RentalAmenityOptions);