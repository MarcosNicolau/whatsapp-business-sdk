import axios, { AxiosRequestConfig } from "axios";

interface RestClientParams {
	baseURL?: string;
	apiToken?: string;
}

export class BaseRestClient {
	private apiToken?: string;
	baseUrl?: string;

	constructor({ apiToken, baseUrl }: BaseRestClient) {
		this.baseUrl = baseUrl;
		this.apiToken = apiToken;
	}
}

export const createRestClient = ({ baseURL, apiToken }: RestClientParams) => {
	const fetch = axios.create({
		headers: {
			authorization: `Bearer ${apiToken}`,
		},
		baseURL,
	});

	return {
		get: async <Response = any, Params = Record<string, string>>(
			endpoint: string,
			params?: Params,
			config?: AxiosRequestConfig
		) => (await fetch.get<Response>(endpoint, { params, ...config })).data,
		post: async <Response = any, Payload = Record<string, any>>(
			endpoint: string,
			payload?: Payload,
			config?: AxiosRequestConfig
		) => (await fetch.post<Response>(endpoint, payload, config)).data,
		put: async <Response = any, Payload = Record<string, any>>(
			endpoint: string,
			payload?: Payload,
			config?: AxiosRequestConfig
		) => (await fetch.put<Response>(endpoint, payload, config)).data,
		delete: async <Response = any, Params = Record<string, any>>(
			endpoint: string,
			params?: Params,
			config?: AxiosRequestConfig
		) => (await fetch.delete<Response>(endpoint, { params, ...config })).data,
	};
};
