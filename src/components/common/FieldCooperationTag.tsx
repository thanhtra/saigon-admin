'use client';

import { Box } from '@mui/material';
import { FieldCooperation } from '@/common/enum';
import { FieldCooperationLabels } from '@/common/const';
import { FieldCooperationTagStyles } from '@/common/style';

interface Props {
    value: FieldCooperation;
    clickable?: boolean;
    onClick?: () => void;
}

export default function FieldCooperationTag({
    value,
    clickable = false,
    onClick,
}: Props) {
    const style = FieldCooperationTagStyles[value];

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
            {FieldCooperationLabels[value]}
        </Box>
    );
}
