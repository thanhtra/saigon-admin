'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Collapse,
    Toolbar,
    Box,
    Typography,
} from '@mui/material';
import {
    ExpandLess,
    ExpandMore,
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
    const [openTiktok, setOpenTiktok] = useState(false);
    const [openFacebook, setOpenFacebook] = useState(false);
    const [openLinkedIn, setOpenLinkedIn] = useState(false);
    const [openYoutube, setOpenYoutube] = useState(false);
    const [openData, setOpenData] = useState(false);
    const [openThreads, setOpenThreads] = useState(false);
    const [openPinterest, setOpenPinterest] = useState(false);
    const [openVideo, setOpenVideo] = useState(false);
    const [openMarketing, setOpenMarketing] = useState(false);


    const toggleTiktok = () => setOpenTiktok(!openTiktok);
    const toggleFacebook = () => setOpenFacebook(!openFacebook);
    const toggleLinkedIn = () => setOpenLinkedIn(!openLinkedIn);
    const toggleYoutube = () => setOpenYoutube(!openYoutube);
    const toggleData = () => setOpenData(!openData);
    const toggleThreads = () => setOpenThreads(!openThreads);
    const togglePinterest = () => setOpenPinterest(!openPinterest);
    const toggleVideo = () => setOpenVideo(!openVideo);
    const toggleMarketing = () => setOpenMarketing(!openMarketing);


    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto', paddingTop: "10px", marginBottom: "50px", }}>
                <List>
                    <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        href="/user"
                        selected={isActive('/user')}
                    >
                        <ListItemText primary="Tài khoản" />
                    </ListItemButton>

                    <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        href="/collaborator"
                        selected={isActive('/collaborator')}
                    >
                        <ListItemText primary="Cộng tác" />
                    </ListItemButton>

                    <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        href="/tenant"
                        selected={isActive('/tenant')}
                    >
                        <ListItemText primary="Khách hàng" />
                    </ListItemButton>

                    <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        href="/rental"
                        selected={isActive('/rental')}
                    >
                        <ListItemText primary="Nhà cho thuê" />
                    </ListItemButton>
                    <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        href="/room"
                        selected={isActive('/room')}
                    >
                        <ListItemText primary="Phòng trọ" />
                    </ListItemButton>
                    <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        href="/booking"
                        selected={isActive('/booking')}
                    >
                        <ListItemText primary="Lịch xem phòng" />
                    </ListItemButton>
                    <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        href="/contract"
                        selected={isActive('/contract')}
                    >
                        <ListItemText primary="Hợp đồng" />
                    </ListItemButton>
                    <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        href="/commission"
                        selected={isActive('/commission')}
                    >
                        <ListItemText primary="Hoa hồng" />
                    </ListItemButton>
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
