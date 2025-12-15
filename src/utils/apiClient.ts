import axios from "axios";

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

export async function get(url: string, params?: Record<string, any>) {
	try {
		const response = await apiClient.get(url, { params });
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}


// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function post(url: string, body: any) {
	try {
		const response = await apiClient.post(url, body);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function put(url: string, body: any) {
	try {
		const response = await apiClient.put(url, body);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function del(url: string) {
	try {
		const response = await apiClient.delete(url);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
