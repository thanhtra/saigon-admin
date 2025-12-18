import { Province } from '@/common/type';
import rawData from './location.json';

const locations = rawData as Province[];


let cachedLocations: typeof locations | null = null;

export const getLocationsCached = () => {
    if (!cachedLocations) {
        cachedLocations = locations;
    }
    return cachedLocations;
};
