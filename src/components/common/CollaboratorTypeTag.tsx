'use client';

import { Box } from '@mui/material';
import { CollaboratorType } from '@/common/enum';
import { CollaboratorTypeLabels } from '@/common/const';
import { CollaboratorTypeTagStyles } from '@/common/style';

interface Props {
    value: CollaboratorType;
    clickable?: boolean;
    onClick?: () => void;
}

export default function CollaboratorTypeTag({
    value,
    clickable = false,
    onClick,
}: Props) {
    const style = CollaboratorTypeTagStyles[value];

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
            {CollaboratorTypeLabels[value]}
        </Box>
    );
}
