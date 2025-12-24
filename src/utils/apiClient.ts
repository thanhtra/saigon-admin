// src/utils/apiClient.ts
import axios from 'axios';
import { setupAuthInterceptor } from './authInterceptor';

const apiClient = axios.create({
	baseURL:
		process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
	withCredentials: true,
});

// ✅ FIX TYPE AXIOS v1+
apiClient.interceptors.request.use(config => {
	// FormData → để axios tự set multipart
	if (config.data instanceof FormData) {
		config.headers?.delete?.('Content-Type');
	} else {
		config.headers?.set?.('Content-Type', 'application/json');
	}
	return config;
});

// 🔥 response interceptor
setupAuthInterceptor(apiClient);

export default apiClient;
