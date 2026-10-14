export const formatDateTimeVN = (value: string): string => {
    if (!value) return '';

    // value = "2026-01-23T19:00"
    const [date, time] = value.split('T');
    const [year, month, day] = date.split('-');

    return `${day}-${month}-${year} ${time}`;
};




export const toDatetimeLocal = (value: string): string => {
    if (!value) return '';

    // value: "2026-01-23T19:00"
    return value.slice(0, 16);
};

export const isAtLeastMinutesLater = (
    value?: string,
    minutes = 10,
): true | string => {
    if (!value) return 'Vui lòng chọn thời gian xem';

    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const minValue =
        `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
        `T${pad(now.getHours())}:${pad(now.getMinutes())}`;

    return value >= minValue
        ? true
        : `Thời gian xem phải sau hiện tại ít nhất ${minutes} phút`;
};

export const formatDateTime = (
    date: string | Date | null | undefined,
): string => {
    if (!date) return '';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return '';

    const formatted = new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).formatToParts(parsedDate);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
        formatted.find((part) => part.type === type)?.value ?? '';

    return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}`;
};
