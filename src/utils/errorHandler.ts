import { DefaultWABAErrorAPI } from "./../types";
import { ERROR_CODES, WABAErrorAPI } from "../types";

export const WABAErrorHandler = (error: DefaultWABAErrorAPI) => {
	const message = ERROR_CODES[error?.error?.code] || error?.error?.message;
	const err: WABAErrorAPI = { ...error?.error, message };
	return Promise.reject(err.message ? err : error);
};
