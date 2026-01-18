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

import { RentalStatus } from '@/common/enum';
import { RentalStatusLabels } from '@/common/const';
import RentalStatusTag from './RentalStatusTag';

interface RentalStatusDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (status: RentalStatus) => void | Promise<void>;

    currentStatus: RentalStatus | null;
    loading?: boolean;
}

const RentalStatusDialog: React.FC<RentalStatusDialogProps> = ({
    open,
    onClose,
    onConfirm,
    currentStatus,
    loading = false,
}) => {
    const [status, setStatus] = React.useState<RentalStatus | ''>(
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
                Cập nhật trạng thái nhà
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    {/* ===== CURRENT STATUS ===== */}
                    <Typography variant="body2" color="text.secondary">
                        Trạng thái hiện tại
                    </Typography>

                    {currentStatus && (
                        <RentalStatusTag status={currentStatus} />
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
                            setStatus(e.target.value as RentalStatus)
                        }
                    >
                        {Object.values(RentalStatus).map((value) => (
                            <MenuItem key={value} value={value}>
                                {RentalStatusLabels[value]}
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

export default RentalStatusDialog;
