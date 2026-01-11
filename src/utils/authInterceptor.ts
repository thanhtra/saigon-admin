import { LOGOUT_FLAG } from '@/common/const';
import { AxiosError, AxiosInstance } from 'axios';

let isRefreshing = false;
let forceLogout = false;
let queue: Array<(success: boolean) => void> = [];

/**
 * Clear toàn bộ queue khi refresh fail
 */
const clearQueue = () => {
    queue.forEach(cb => cb(false));
    queue = [];
};

/**
 * Logout cứng – dùng cho refresh-token fail
 */
const forceLogoutNow = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(LOGOUT_FLAG, '1');
        window.location.replace('/login');
    }
};

/**
 * Setup auth interceptor
 */
export function setupAuthInterceptor(apiClient: AxiosInstance) {
    apiClient.interceptors.response.use(
        response => response,
        async (error: AxiosError) => {
            const originalRequest: any = error.config;
            const status = error.response?.status;
            const url = originalRequest?.url || '';

            /**
             * 🔒 ĐÃ LOGOUT → KHÔNG XỬ LÝ GÌ NỮA
             */
            if (forceLogout) {
                return Promise.reject(error);
            }

            /**
             * 🔥 REFRESH TOKEN FAIL → LOGOUT NGAY
             */
            if (url.includes('/auth/refresh-token') && status === 401) {
                forceLogout = true;
                clearQueue();
                forceLogoutNow();
                return Promise.reject(error);
            }

            /**
             * ⚠️ ACCESS TOKEN EXPIRED
             */
            if (status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                /**
                 * ⏳ Đang refresh → đẩy request vào queue
                 */
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        queue.push(success => {
                            success
                                ? resolve(apiClient(originalRequest))
                                : reject(error);
                        });
                    });
                }

                isRefreshing = true;

                try {
                    /**
                     * 🔄 CALL REFRESH TOKEN
                     */
                    await apiClient.get('/auth/refresh-token');

                    /**
                     * ✅ REFRESH OK → chạy lại toàn bộ queue
                     */
                    queue.forEach(cb => cb(true));
                    queue = [];

                    return apiClient(originalRequest);
                } catch (err) {
                    /**
                     * ❌ REFRESH FAIL → LOGOUT CỨNG
                     */
                    forceLogout = true;
                    clearQueue();
                    forceLogoutNow();
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        },
    );
}
