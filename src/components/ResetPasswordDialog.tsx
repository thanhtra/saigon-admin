'use client';

import { UserRoleOptions } from '@/common/const';
import { UserRole } from '@/common/enum';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export interface UserResetInfo {
    id: string;
    phone: string;
    name: string;
    role: string;
}

interface ResetPasswordDialogProps {
    open: boolean;
    onClose: () => void;
    user: UserResetInfo | null;
    onReset: (userId: string) => Promise<string>;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
    open,
    onClose,
    user,
    onReset,
}) => {
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState<string | null>(null);

    if (!user) return null;

    const handleClose = () => {
        if (!loading) {
            setNewPassword(null);
            onClose();
        }
    };

    const handleReset = async () => {
        try {
            setLoading(true);
            const newPassword = await onReset(user.id);

            if (newPassword) {
                setNewPassword(newPassword);
            }

        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(
            `Tên đăng nhập: ${user.phone}
Mật khẩu: ${newPassword}

Anh/Chị vui lòng lưu lại mật khẩu tránh trường hợp quên nhé!`
        );

        toast.success('Đã sao chép');
    };

    return (
        <Dialog open={open} onClose={undefined} maxWidth="xs" fullWidth>
            <DialogTitle fontWeight={600}>
                {newPassword ? 'Reset thành công' : 'Xác nhận reset mật khẩu'}
            </DialogTitle>

            <DialogContent>
                {!newPassword ? (
                    <DialogContentText component="div">
                        <Stack spacing={1}>
                            <Typography>
                                Bạn muốn reset mật khẩu mới cho tài khoản:
                            </Typography>
                            <Typography>• SĐT: <b>{user.phone}</b></Typography>
                            <Typography>• Tên: <b>{user.name}</b></Typography>
                            <Typography>• Vai trò: <b>{UserRoleOptions[user.role as UserRole]}</b></Typography>
                        </Stack>
                    </DialogContentText>
                ) : (
                    <DialogContentText component="div">
                        <Stack spacing={1.5}>
                            <Typography>
                                Tên đăng nhập: <b>{user.phone}</b>
                            </Typography>
                            <Typography>
                                Mật khẩu: <b>{newPassword}</b>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Anh/Chị vui lòng lưu lại mật khẩu tránh trường hợp quên nhé!
                            </Typography>
                        </Stack>
                    </DialogContentText>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                {!newPassword ? (
                    <>
                        <Button
                            onClick={handleClose}
                            disabled={loading}
                            variant="outlined"
                        >
                            Huỷ
                        </Button>

                        <Button
                            onClick={handleReset}
                            color="error"
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={16} /> : null}
                        >
                            Reset mật khẩu
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            startIcon={<ContentCopyIcon />}
                            variant="outlined"
                            onClick={handleCopy}
                        >
                            Copy mật khẩu
                        </Button>

                        <Button
                            onClick={handleClose}
                            variant="contained"
                        >
                            Đóng
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ResetPasswordDialog;
