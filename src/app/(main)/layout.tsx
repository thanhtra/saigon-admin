'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading || !user) return null;

  return (
    <>
      <Navbar onToggleSidebar={() => setMobileOpen(prev => !prev)} />

      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        // sx={{
        //   flexGrow: 1,
        //   ml: { md: '240px' }, // chỉ chừa sidebar khi desktop
        //   mt: '64px',
        //   p: 2,
        // }}
        sx={{
          flexGrow: 1,
          ml: { md: '240px' },
          mt: '64px',
          p: { xs: 1, md: 2 },

          '& .MuiCard-root': {
            p: { xs: '4px', md: '24px' },
          },
        }}
      >
        {children}
      </Box>
    </>
  );
}
