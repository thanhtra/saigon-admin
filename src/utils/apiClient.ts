import axios from 'axios';
import { setupAuthInterceptor } from './authInterceptor';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
	baseURL: `${baseUrl}/api`,
	withCredentials: true,
});


apiClient.interceptors.request.use(config => {
	if (config.data instanceof FormData) {
		config.headers?.delete?.('Content-Type');
	} else {
		config.headers?.set?.('Content-Type', 'application/json');
	}
	return config;
});

setupAuthInterceptor(apiClient);

export default apiClient;
