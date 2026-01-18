export const formatDateTimeVN = (date: Date | string): string => {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const nowVN = () => new Date();

export const toDatetimeLocal = (value: string | Date): string => {
    if (!value) return '';

    const d = new Date(value);
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
        d.getHours(),
    )}:${pad(d.getMinutes())}`;
};


export const isAtLeastMinutesLater = (
    value?: string,
    minutes = 10,
): true | string => {
    if (!value) return 'Vui lòng chọn thời gian xem';

    const selectedTime = new Date(value).getTime();
    const minTime = Date.now() + minutes * 60 * 1000;

    if (Number.isNaN(selectedTime)) {
        return 'Thời gian xem không hợp lệ';
    }

    return selectedTime >= minTime
        ? true
        : `Thời gian xem phải sau hiện tại ít nhất ${minutes} phút`;
};
