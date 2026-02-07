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

import { CollaboratorType } from '@/common/enum';
import { CollaboratorTypeLabels } from '@/common/const';
import CollaboratorTypeTag from './CollaboratorTypeTag';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: (value: CollaboratorType) => void | Promise<void>;
    currentValue: CollaboratorType | null;
    loading?: boolean;
}

const CollaboratorTypeDialog: React.FC<Props> = ({
    open,
    onClose,
    onConfirm,
    currentValue,
    loading = false,
}) => {
    const [value, setValue] = React.useState<CollaboratorType | ''>(
        currentValue || '',
    );

    React.useEffect(() => {
        if (currentValue) {
            setValue(currentValue);
        }
    }, [currentValue]);

    const handleClose = () => {
        if (!loading) onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle fontWeight={500}>
                Cập nhật loại cộng tác viên
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <Typography variant="body2" color="text.secondary">
                        Loại hiện tại
                    </Typography>

                    {currentValue && (
                        <CollaboratorTypeTag value={currentValue} />
                    )}

                    <Typography variant="body2" color="text.secondary">
                        Loại mới
                    </Typography>

                    <Select
                        size="small"
                        fullWidth
                        value={value}
                        onChange={(e) =>
                            setValue(e.target.value as CollaboratorType)
                        }
                    >
                        {Object.values(CollaboratorType).map((v) => (
                            <MenuItem key={v} value={v}>
                                {CollaboratorTypeLabels[v]}
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
                    disabled={loading || !value || value === currentValue}
                    onClick={() => {
                        if (!value || value === currentValue) return;
                        onConfirm(value);
                    }}
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

export default CollaboratorTypeDialog;
