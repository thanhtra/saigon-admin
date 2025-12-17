// src/utils/apiClient.ts
import axios from 'axios';
import { setupAuthInterceptor } from './authInterceptor';

const apiClient = axios.create({
	baseURL:
		process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

// 🔥 gắn interceptor
setupAuthInterceptor(apiClient);

export default apiClient;
