import { getLocationsCached } from "@/utils/location";
import { Option } from './type';
import { SelectOption } from "./interface";

const locations = getLocationsCached();

export const capitalizeWords = (name: string): string => {
    if (!name) return '';
    return name
        .toLowerCase()
        .split(' ')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


/* ================= PROVINCE ================= */

export const getProvinceOptions = (): Option[] =>
    locations.map(p => ({
        label: p.Name,
        value: p.Id,
    }));

/* ================= DISTRICT ================= */

export const getDistrictOptions = (provinceId?: string): Option[] => {
    if (!provinceId) return [];

    const province = locations.find(p => p.Id === provinceId);
    if (!province) return [];

    return province.Districts.map(d => ({
        label: d.Name,
        value: d.Id,
    }));
};

/* ================= WARD ================= */

export const getWardOptions = (
    provinceId?: string,
    districtId?: string
): Option[] => {
    if (!provinceId || !districtId) return [];

    const province = locations.find(p => p.Id === provinceId);
    const district = province?.Districts.find(d => d.Id === districtId);

    return (
        district?.Wards.map(w => ({
            label: w.Name,
            value: w.Id,
        })) || []
    );
};


export const buildAddressDetail = ({
    provinceId,
    districtId,
    wardId,
    street,
    houseNumber,
}: {
    provinceId?: string;
    districtId?: string;
    wardId?: string;
    street?: string;
    houseNumber?: string;
}) => {
    const province = locations.find(p => p.Id === provinceId);
    const district = province?.Districts.find(d => d.Id === districtId);
    const ward = district?.Wards.find(w => w.Id === wardId);

    const adr = [
        street,
        ward?.Name,
        district?.Name,
        province?.Name,
    ]
        .filter(Boolean)
        .join(', ');

    return `${houseNumber} ${adr}`;
};


export const mapCollaboratorOptions = (data: any[] = []) => {
    return data.map(c => ({
        label: c.user.name,
        value: c.id,
    }));
};

export const mapCollaboratorOptionsNamePhone = (data: any[] = []) => {
    return data.map(c => ({
        label: `${c.name} - ${c.phone}`,
        value: c.id,
    }));
};

export const truncate = (text?: string, limit = 40) =>
    !text ? '-' : text.length > limit ? `${text.slice(0, limit)}...` : text;


export const formatVnd = (
    value?: number | null,
    options?: {
        suffix?: string;
        emptyText?: string;
    },
) => {
    if (value === null || value === undefined) {
        return options?.emptyText ?? '-';
    }

    return `${value.toLocaleString('vi-VN')}${options?.suffix ?? ' đ'}`;
};


export const formatArea = (
    value?: number | null,
    options?: {
        unit?: string;
        emptyText?: string;
    },
) => {
    if (value === null || value === undefined) {
        return options?.emptyText ?? '-';
    }

    return `${value} ${options?.unit ?? 'm²'}`;
};


export const formatDateTime = (
    value?: string | Date,
    locale: string = 'vi-VN',
) => {
    if (!value) return '-';

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export const resolveUploadUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    const base = process.env.NEXT_PUBLIC_API_URL;
    return `${base}/uploads${path}`;
};

export function createOptionsFromLabels<
    T extends string
>(
    labels: Record<T, string>,
    {
        includeAll = false,
        allLabel = 'Tất cả',
    }: {
        includeAll?: boolean;
        allLabel?: string;
    } = {}
): SelectOption<T>[] {
    const options: SelectOption<T>[] = (
        Object.keys(labels) as T[]
    ).map((key) => ({
        value: key,
        label: labels[key], // ✅ string
    }));

    if (includeAll) {
        return [{ value: '', label: allLabel }, ...options];
    }

    return options;
}
