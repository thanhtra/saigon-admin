import { getLocationsCached } from "@/utils/location";
import { Option } from './type';

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

    return [
        houseNumber,
        street,
        ward?.Name,
        district?.Name,
        province?.Name,
    ]
        .filter(Boolean)
        .join(', ');
};


export const mapCollaboratorOptions = (data: any[] = []) => {
    return data.map(c => ({
        label: c.name,
        value: c.id,
    }));
};
