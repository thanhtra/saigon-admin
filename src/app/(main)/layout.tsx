'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Box } from '@mui/material';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // hoặc spinner
  }

  if (!user) {
    return null; // redirect đã xử lý trong AuthProvider
  }


  return (
    <>
      <Navbar />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: '240px',
          mt: '64px',
          p: 2,
        }}
      >
        {children}
      </Box>
    </>
  );
}
