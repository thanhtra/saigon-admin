'use client';

import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
    const router = useRouter();
    const { user, logout } = useAuth();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const openMenu = Boolean(anchorEl);

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: '#9BA492',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar
                    sx={{
                        minHeight: 56,
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography fontSize={16} fontWeight={600}>
                        YYY
                    </Typography>

                    {/* PROFILE */}
                    <Box>
                        <IconButton
                            size="small"
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                        >
                            <Avatar
                                sx={{ width: 32, height: 32, fontSize: 14 }}
                            >
                                {user?.name?.charAt(0) || 'U'}
                            </Avatar>
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={() => setAnchorEl(null)}
                            PaperProps={{
                                sx: {
                                    mt: 1,
                                    minWidth: 160,
                                    borderRadius: 1,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                                    fontSize: 13,
                                },
                            }}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <MenuItem
                                sx={{ py: 0.75 }}
                                onClick={() => {
                                    setAnchorEl(null);
                                    router.push('/profile');
                                }}
                            >
                                Profile
                            </MenuItem>

                            <MenuItem
                                sx={{ py: 0.75, color: 'error.main' }}
                                onClick={() => {
                                    setAnchorEl(null);
                                    setOpenLogoutDialog(true);
                                }}
                            >
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* CONFIRM LOGOUT */}
            <Dialog
                open={openLogoutDialog}
                onClose={() => setOpenLogoutDialog(false)}
                PaperProps={{ sx: { borderRadius: 2 } }}
            >
                <DialogTitle fontSize={16} fontWeight={600}>
                    Đăng xuất
                </DialogTitle>

                <DialogContent sx={{ fontSize: 14 }}>
                    Bạn có chắc chắn muốn đăng xuất không?
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        size="small"
                        onClick={() => setOpenLogoutDialog(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={logout}
                    >
                        Đăng xuất
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Navbar;
