// components/common/RoomStatusDialog.tsx
'use client';

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    MenuItem,
    Select,
    Stack,
    Typography,
} from '@mui/material';

import { RoomStatus } from '@/common/enum';
import { RoomStatusLabels } from '@/common/const';
import RoomStatusTag from './RoomStatusTag';

interface RoomStatusDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (status: RoomStatus) => void | Promise<void>;

    currentStatus: RoomStatus | null;
    loading?: boolean;
}

const RoomStatusDialog: React.FC<RoomStatusDialogProps> = ({
    open,
    onClose,
    onConfirm,
    currentStatus,
    loading = false,
}) => {
    const [status, setStatus] = React.useState<RoomStatus | ''>(
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
                Cập nhật trạng thái phòng
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    {/* ===== CURRENT STATUS ===== */}
                    <Typography variant="body2" color="text.secondary">
                        Trạng thái hiện tại
                    </Typography>

                    {currentStatus && (
                        <RoomStatusTag status={currentStatus} />
                    )}

                    {/* ===== NEW STATUS ===== */}
                    <Typography variant="body2" color="text.secondary">
                        Trạng thái mới
                    </Typography>

                    <Select
                        size="small"
                        fullWidth
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value as RoomStatus)
                        }
                    >
                        {Object.values(RoomStatus).map((value) => (
                            <MenuItem key={value} value={value}>
                                {RoomStatusLabels[value]}
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

export default RoomStatusDialog;
