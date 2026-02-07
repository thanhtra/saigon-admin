'use client';

import { RentalAmenityOptions } from '@/common/const';
import { formatVnd, resolveUploadUrl } from '@/common/service';
import { Room } from '@/types';
import {
    DoorFront,
    Groups,
    Home,
    Payments,
    SquareFoot,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Typography,
} from '@mui/material';
import * as React from 'react';

interface RoomInfoDialogProps {
    open: boolean;
    onClose: () => void;
    room: Room | null;
}

export default function RoomInfoDialog({
    open,
    onClose,
    room,
}: RoomInfoDialogProps) {
    if (!open || !room) return null;

    const images = room.uploads?.filter(
        (u) => u.file_type === 'image',
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle fontWeight={500}>
                {room.title}
                <Typography variant="body2" color="text.secondary">
                    Mã phòng: {room.room_code}
                </Typography>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={3}>
                    {/* ===== COMPACT INFO BAR ===== */}
                    <Box
                        display="flex"
                        flexWrap="wrap"
                        gap={2}
                        color="text.secondary"
                        fontSize={13}
                    >
                        <InfoItem icon={<Home sx={{ fontSize: "12px" }} />} label={`Tầng ${room.floor ?? 'Trệt'}`} />
                        <InfoItem
                            icon={<DoorFront sx={{ fontSize: "12px" }} />}
                            label={`Phòng ${room.room_number ?? '-'}`}
                        />
                        <InfoItem
                            icon={<SquareFoot sx={{ fontSize: "12px" }} />}
                            label={`${room.area ?? '-'} m²`}
                        />
                        <InfoItem
                            icon={<Groups sx={{ fontSize: "12px" }} />}
                            label={`${room.max_people ?? '-'} người`}
                        />
                        <InfoItem
                            icon={<Payments sx={{ fontSize: "12px" }} />}
                            label={formatVnd(Number(room.price))}
                            strong
                        />
                    </Box>

                    <Divider />

                    {/* ===== IMAGES ===== */}
                    {images?.length ? (
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(auto-fill, minmax(140px, 1fr))"
                            gap={1.5}
                        >
                            {images.map((img) => (
                                <Box
                                    key={img.id}
                                    component="img"
                                    src={resolveUploadUrl(img.file_path)}
                                    alt={room.title}
                                    sx={{
                                        width: '100%',
                                        height: 120,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                />
                            ))}
                        </Box>
                    ) : null}

                    {/* ===== DESCRIPTION ===== */}
                    {room.description && (
                        <Stack spacing={0.5}>
                            <Typography
                                variant="body2"
                                fontWeight={500}
                            >
                                Mô tả
                            </Typography>
                            <Typography>
                                {room.description}
                            </Typography>
                        </Stack>
                    )}

                    {/* ===== AMENITIES ===== */}
                    {room.amenities?.length ? (
                        <Stack spacing={1}>
                            <Typography
                                variant="body2"
                                fontWeight={500}
                            >
                                Tiện ích
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {room.amenities.map((item) => (
                                    <Chip
                                        key={item}
                                        label={RentalAmenityOptions[item]}
                                        size="small"
                                    />
                                ))}
                            </Box>
                        </Stack>
                    ) : null}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button variant="contained" onClick={onClose}>
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}

/* =======================
 Sub component
======================= */
function InfoItem({
    icon,
    label,
    strong,
}: {
    icon: React.ReactNode;
    label: string;
    strong?: boolean;
}) {
    return (
        <Box display="flex" alignItems="center" gap={0.5}>
            {icon}
            <Typography
                fontSize={16}
                fontWeight={strong ? 600 : 400}
                color={strong ? 'primary' : 'inherit'}
            >
                {label}
            </Typography>
        </Box>
    );
}
