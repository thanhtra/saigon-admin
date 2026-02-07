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

import { FieldCooperation } from '@/common/enum';
import { FieldCooperationLabels } from '@/common/const';
import FieldCooperationTag from './FieldCooperationTag';

interface FieldCooperationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (value: FieldCooperation) => void | Promise<void>;

    currentValue: FieldCooperation | null;
    loading?: boolean;
}

const FieldCooperationDialog: React.FC<FieldCooperationDialogProps> = ({
    open,
    onClose,
    onConfirm,
    currentValue,
    loading = false,
}) => {
    const [value, setValue] = React.useState<FieldCooperation | ''>(
        currentValue || '',
    );

    React.useEffect(() => {
        if (currentValue) {
            setValue(currentValue);
        }
    }, [currentValue]);

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
            <DialogTitle fontWeight={500}>
                Cập nhật lĩnh vực hợp tác
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    {/* ===== CURRENT VALUE ===== */}
                    <Typography variant="body2" color="text.secondary">
                        Lĩnh vực hiện tại
                    </Typography>

                    {currentValue && (
                        <FieldCooperationTag value={currentValue} />
                    )}

                    {/* ===== NEW VALUE ===== */}
                    <Typography variant="body2" color="text.secondary">
                        Lĩnh vực mới
                    </Typography>

                    <Select
                        size="small"
                        fullWidth
                        value={value}
                        onChange={(e) =>
                            setValue(e.target.value as FieldCooperation)
                        }
                    >
                        {Object.values(FieldCooperation).map((v) => (
                            <MenuItem key={v} value={v}>
                                {FieldCooperationLabels[v]}
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
                        if (!value || value === currentValue) return;
                        onConfirm(value);
                    }}
                    disabled={
                        loading || !value || value === currentValue
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

export default FieldCooperationDialog;
