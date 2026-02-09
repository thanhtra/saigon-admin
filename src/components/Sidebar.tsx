'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Toolbar,
    Box,
    useTheme,
    useMediaQuery,
} from '@mui/material';

const drawerWidth = 240;

interface SidebarProps {
    mobileOpen: boolean;
    onCloseMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    mobileOpen,
    onCloseMobile,
}) => {
    const pathname = usePathname();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const isActive = (href: string) => pathname === href;

    const content = (
        <>
            <Toolbar />
            <Box sx={{ overflow: 'auto', pt: 1, mb: 6 }}>
                <List>
                    {[
                        ['/user', 'Tài khoản'],
                        ['/collaborator', 'Cộng tác'],
                        ['/tenant', 'Khách hàng'],
                        ['/land', 'Bất động sản'],
                        ['/rental', 'Nhà cho thuê'],
                        ['/room', 'Phòng trọ'],
                        ['/booking', 'Lịch xem phòng'],
                        ['/contract', 'Hợp đồng'],
                        ['/commission', 'Hoa hồng'],
                    ].map(([href, label]) => (
                        <ListItemButton
                            key={href}
                            component={Link}
                            href={href}
                            selected={isActive(href)}
                            sx={{ pl: 4 }}
                            onClick={isMobile ? onCloseMobile : undefined}
                        >
                            <ListItemText primary={label} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </>
    );

    return (
        <>
            {/* MOBILE */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onCloseMobile}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                    },
                }}
            >
                {content}
            </Drawer>

            {/* DESKTOP */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                open
            >
                {content}
            </Drawer>
        </>
    );
};

export default Sidebar;
