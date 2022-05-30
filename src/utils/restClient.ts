import axios, { AxiosRequestConfig } from "axios";

interface RestClientParams {
	baseURL?: string;
	apiToken?: string;
	errorHandler?: (error: any) => any;
}

export const createRestClient = ({ baseURL, apiToken, errorHandler }: RestClientParams) => {
	const fetch = axios.create({
		headers: {
			authorization: `Bearer ${apiToken}`,
		},
		baseURL,
	});
	fetch.interceptors.response.use(
		(response) => response,
		async (error) => errorHandler && errorHandler(error)
	);

	return {
		fetch,
		get: async <Response = any, Params = Record<string, string>>(
			endpoint: string,
			params?: Params,
			config?: AxiosRequestConfig
		) => (await fetch.get<Response>(endpoint, { params, ...config }))?.data,
		post: async <Response = any, Payload = Record<string, any>>(
			endpoint: string,
			payload?: Payload,
			config?: AxiosRequestConfig
		) => (await fetch.post<Response>(endpoint, payload, config))?.data,
		put: async <Response = any, Payload = Record<string, any>>(
			endpoint: string,
			payload?: Payload,
			config?: AxiosRequestConfig
		) => (await fetch.put<Response>(endpoint, payload, config))?.data,
		delete: async <Response = any, Params = Record<string, any>>(
			endpoint: string,
			params?: Params,
			config?: AxiosRequestConfig
		) => (await fetch.delete<Response>(endpoint, { params, ...config }))?.data,
	};
};
