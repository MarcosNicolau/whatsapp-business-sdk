import { DefaultWABAErrorAPI } from "./../types";
import { ERROR_CODES } from "../types";

export const WABAErrorHandler = (error: DefaultWABAErrorAPI) => {
	const err = error?.error;
	/**
	 * If the err does not match the WABA schema return whatever error we got
	 * All err responses from whatsapp should follow the DefaultWABAErrorAPI schema
	 */
	if (!err) return Promise.reject(error);
	err.message = ERROR_CODES[err.code] || err.message;
	if (!err.error_subcode) err.error_subcode = NaN;
	if (!err.error_data) err.error_data = { details: "", messaging_product: "whatsapp" };

	return Promise.reject(err);
};
