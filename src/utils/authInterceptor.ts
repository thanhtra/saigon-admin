// src/utils/authInterceptor.ts
import { AxiosError, AxiosInstance } from 'axios';

let isRefreshing = false;
let queue: Array<() => void> = [];

const processQueue = () => {
    queue.forEach(cb => cb());
    queue = [];
};

export function setupAuthInterceptor(apiClient: AxiosInstance) {
    apiClient.interceptors.response.use(
        res => res,
        async (error: AxiosError) => {
            const originalRequest: any = error.config;
            const url = originalRequest?.url || '';

            // ❌ bỏ qua các api không cần refresh
            if (
                url.includes('/auth/me') ||
                url.includes('/auth/refresh-token')
            ) {
                return Promise.reject(error);
            }

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                if (isRefreshing) {
                    return new Promise(resolve => {
                        queue.push(() => resolve(apiClient(originalRequest)));
                    });
                }

                isRefreshing = true;

                try {
                    await apiClient.get('/auth/refresh-token');
                    processQueue();
                    return apiClient(originalRequest);
                } catch (e) {
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(e);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        },
    );
}
