'use client';

import { Box } from '@mui/material';
import { RoomStatus } from '@/common/enum';
import { RoomStatusLabels } from '@/common/const';
import { RoomStatusTagStyles } from '@/common/style';

interface Props {
    status: RoomStatus;
    clickable?: boolean;
    onClick?: () => void;
}

export default function RoomStatusTag({
    status,
    clickable = false,
    onClick,
}: Props) {
    const style = RoomStatusTagStyles[status];

    return (
        <Box
            component="span"
            role={clickable ? 'button' : undefined}
            onClick={onClick}
            sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: '12px',
                fontSize: 12,
                fontWeight: 500,
                whiteSpace: 'nowrap',

                color: style.color,
                backgroundColor: style.background,

                cursor: clickable ? 'pointer' : 'default',
                transition: 'all 0.2s ease',

                ...(clickable && {
                    '&:hover': {
                        opacity: 0.85,
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
                    },
                }),
            }}
        >
            {RoomStatusLabels[status]}
        </Box>
    );
}
