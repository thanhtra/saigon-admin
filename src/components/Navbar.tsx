// components/Navbar.tsx
'use client';

import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar: React.FC = () => {
    return (
        <AppBar position="fixed"
            sx={{
                backgroundColor: '#9BA492',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    XXX
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
