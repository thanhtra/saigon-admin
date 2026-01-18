'use client';

import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import React from 'react';

import { BookingStatusAdminLabels } from '@/common/const';
import { BookingStatus } from '@/common/enum';
import BookingStatusTag from './BookingStatusTag';

interface BookingStatusDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (status: BookingStatus) => void | Promise<void>;

    currentStatus: BookingStatus | null;
    loading?: boolean;
}

const BookingStatusDialog: React.FC<BookingStatusDialogProps> = ({
    open,
    onClose,
    onConfirm,
    currentStatus,
    loading = false,
}) => {
    const [status, setStatus] = React.useState<BookingStatus | ''>(
        currentStatus || '',
    );

    React.useEffect(() => {
        if (currentStatus) {
            setStatus(currentStatus);
        }
    }, [currentStatus]);

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle fontWeight={600}>
                Cập nhật trạng thái lịch xem
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <Typography variant="body2" color="text.secondary">
                        Trạng thái hiện tại
                    </Typography>

                    {currentStatus && (
                        <BookingStatusTag status={currentStatus} />
                    )}

                    <Typography variant="body2" color="text.secondary">
                        Trạng thái mới
                    </Typography>

                    <Select
                        size="small"
                        fullWidth
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value as BookingStatus)
                        }
                    >
                        {Object.values(BookingStatus).map((value) => (
                            <MenuItem key={value} value={value}>
                                {BookingStatusAdminLabels[value]}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    disabled={loading}
                >
                    Huỷ
                </Button>

                <Button
                    variant="contained"
                    onClick={() => {
                        if (!status || status === currentStatus) return;
                        onConfirm(status);
                    }}
                    disabled={
                        loading || !status || status === currentStatus
                    }
                    startIcon={
                        loading ? <CircularProgress size={16} /> : null
                    }
                >
                    Cập nhật
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookingStatusDialog;
