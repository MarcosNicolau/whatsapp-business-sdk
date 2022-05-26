export type BusinessPhoneNumber = {
	verified_name: string;
	display_phone_number: string;
	id: string;
	quality_rating: string;
	code_verification_status?: string;
};

export type GetBusinessPhoneNumberResponse = {
	data: BusinessPhoneNumber[];
	paging: {
		cursors: {
			before: string;
			after: string;
		};
	};
};

export type RequestPhoneNumberVerificationCodePayload = {
	code_method: "SMS" | "VOICE";
	/**
	 * Your locale. For example: "en_US".
	 */
	language: string;
};

export type RequestPhoneNumberVerificationCodeArgs = RequestPhoneNumberVerificationCodePayload & {
	phoneNumberId: string;
};

export type VerifyPhoneNumberArgs = {
	phoneNumberId: string;
	code: string;
};
