import { truncate } from '@/common/service';
import { Tooltip } from '@mui/material';

type TruncateWithTooltipProps = {
    text?: string;
    limit?: number;
};

export function TruncateWithTooltip({
    text,
    limit = 40,
}: TruncateWithTooltipProps) {
    const isTruncated = !!text && text.length > limit;

    return (
        <Tooltip
            title={isTruncated ? text : ''}
            placement="top"
            arrow
            disableHoverListener={!isTruncated}
        >
            <span>
                {truncate(text, limit)}
            </span>
        </Tooltip>
    );
}
