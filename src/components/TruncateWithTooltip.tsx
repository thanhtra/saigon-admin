import { truncate } from '@/common/service';
import { Tooltip } from '@mui/material';

type TruncateWithTooltipProps = {
    text?: string | null | undefined;
    limit?: number;
};

export function TruncateWithTooltip({
    text,
    limit = 100,
}: TruncateWithTooltipProps) {
    const displayText = text || '';

    const isTruncated = displayText.length > limit;

    return (
        <Tooltip
            title={isTruncated ? displayText : ''}
            placement="top"
            arrow
            disableHoverListener={!isTruncated}
        >
            <span>{truncate(displayText, limit)}</span>
        </Tooltip>
    );
}
