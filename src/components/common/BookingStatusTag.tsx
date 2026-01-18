import { Box } from '@mui/material';
import { BookingStatus } from '@/common/enum';
import { BookingStatusTagStyles } from '@/common/style';
import { BookingStatusAdminLabels } from '@/common/const';

interface Props {
    status: BookingStatus;
    onClick?: () => void;
    clickable?: boolean;
}

export default function BookingStatusTag({
    status,
    onClick,
    clickable = false,
}: Props) {
    const style = BookingStatusTagStyles[status];
    const isClickable = clickable || !!onClick;

    return (
        <Box
            component="span"
            role={isClickable ? 'button' : undefined}
            onClick={onClick}
            sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: '12px',
                fontSize: 12,
                fontWeight: 500,
                color: style.color,
                backgroundColor: style.background,
                whiteSpace: 'nowrap',

                cursor: isClickable ? 'pointer' : 'default',
                transition: 'all 0.2s ease',

                ...(isClickable && {
                    '&:hover': {
                        opacity: 0.85,
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
                    },
                }),
            }}
        >
            {BookingStatusAdminLabels[status]}
        </Box>
    );
}
