import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_REACT_APP_API;

export const apiServer = axios.create({
    baseURL: `${baseUrl}/api`,
});

export async function getServer(url: string, params?: Record<string, any>) {
    const response = await apiServer.get(url, { params });
    return response.data;
}