import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'; // link tới backend thật

export const apiServer = axios.create({
    baseURL: API_BASE_URL,
});

export async function getServer(url: string, params?: Record<string, any>) {
    const response = await apiServer.get(url, { params });
    return response.data;
}