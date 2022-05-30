import { DefaultWABAErrorAPI } from "./../types";
import { ERROR_CODES } from "../types";

export const WABAErrorHandler = (error: DefaultWABAErrorAPI) => {
	const err = error?.error || {};
	err.message = ERROR_CODES[err.code];
	if (!err.error_subcode) err.error_subcode = NaN;
	if (!err.error_data) err.error_data = { details: "", messaging_product: "whatsapp" };
	return Promise.reject(err.message ? err : error);
};
