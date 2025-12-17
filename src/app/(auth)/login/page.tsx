'use client';

import { Box } from '@mui/material';
import LoginForm from './LoginForm';

const LoginPage = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f5f5',
            }}
        >
            <LoginForm />
        </Box>
    );
};

export default LoginPage;
