'use client';

import { Box } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    mt?: number;
};

export default function PaginationWrapper({ children, mt = 2 }: Props) {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={mt}
            sx={{
                '& .MuiPagination-root': {
                    '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        minWidth: 36,
                        height: 36,
                        fontWeight: 500,
                    },
                    '& .Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        },
                    },
                },
            }}
        >
            {children}
        </Box>
    );
}
