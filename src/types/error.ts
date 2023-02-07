/**
 * For more detailed descriptions about the API errors go here:
 * https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes
 */
export const ERROR_CODES = {
	0: "AuthException",
	1: "API Unknown",
	2: "API Service",
	3: "API Method",
	4: "API Too Many Calls",
	10: "API Permission Denied",
	100: "Invalid parameter",
	190: "Access token has expired",
	200: "API Permission",
	299: "API Permission",
	368: "Temporarily blocked for policies violations",
	506: "Duplicate Post",
	80007: "Rate limit issues",
	131052: "Media download error",
	131042: "Business eligibility — Payment issue",
	131043: "Message expired",
	130429: "Rate limit hit",
	131045: "Unsigned certificate",
	131016: "Service Overloaded",
	131047: "Re-engagement message",
	131048: "Spam Rate limit hit",
	131000: "Generic Error",
	131051: "Unsupported message type",
	131001: "Message too long",
	131002: "Invalid recipient type",
	131005: "Access denied",
	131006: "Resource not found",
	131008: "Required parameter is missing",
	131009: "Parameter value is not valid",
	131021: "Bad User",
	132000: "Template Param Count Mismatch",
	132001: "Template does not exist",
	132005: "Template Hydrated Text Too Long",
	132007: "Template Format Character Policy Violated",
	132012: "Template Parameter Format Mismatch",
	133000: "Incomplete Delete",
	133001: "Decryption Error",
	133002: "Backup Blob Decryption Error",
	133003: "Recovery Token Decryption Error",
	133004: "Server Temporarily Unavailable",
	133005: "Security PIN Mismatch",
	133006: "Recovery Token Incorrect",
	133007: "Account Blocked",
	133008: "Too Many PIN Guesses",
	133009: "PIN Guessed Too Fast",
	136025: "Verify code error",
} as const;

export type WABAErrorCodes = keyof typeof ERROR_CODES;
export type WABAErrorMessages = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/**
 * For more detailed descriptions about the API errors go here:
 * https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes
 */
export type WABAErrorAPI = {
	message: WABAErrorMessages;
	type: string;
	code: WABAErrorCodes; // please refer to the Error Codes section
	error_data?: {
		messaging_product: "whatsapp";
		/**
		 * detailed error message to help with debugging
		 */
		details: string;
	};
	error_subcode?: number;
	fbtrace_id: string;
};

export type DefaultWABAErrorAPI = {
	error: WABAErrorAPI;
};
