'use client';

import { AuthProvider } from '@/context/AuthContext';
import theme from '@/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="vi">
            <body>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ThemeProvider>
                <ToastContainer position="top-right" autoClose={2000} />
            </body>
        </html>
    );
}
