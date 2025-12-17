import apiClient from './apiClient';

export async function get(url: string, params?: Record<string, any>) {
    const res = await apiClient.get(url, { params });
    return res.data;
}

export async function post(url: string, body?: any) {
    const res = await apiClient.post(url, body);
    return res.data;
}

export async function put(url: string, body?: any) {
    const res = await apiClient.put(url, body);
    return res.data;
}

export async function del(url: string) {
    const res = await apiClient.delete(url);
    return res.data;
}
