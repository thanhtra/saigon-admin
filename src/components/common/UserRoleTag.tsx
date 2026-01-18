'use client';

import { Box } from '@mui/material';
import { UserRole } from '@/common/enum';
import { UserRoleOptions } from '@/common/const';
import { UserRoleTagStyles } from '@/common/style';

interface Props {
    value: UserRole;
}

export default function UserRoleTag({ value }: Props) {
    const style = UserRoleTagStyles[value] ?? {
        color: '#000',
        background: '#f5f5f5',
    };

    return (
        <Box
            component="span"
            sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 500,
                whiteSpace: 'nowrap',

                color: style.color,
                backgroundColor: style.background,

                cursor: 'default',
                userSelect: 'none',
            }}
        >
            {UserRoleOptions[value]}
        </Box>
    );
}
