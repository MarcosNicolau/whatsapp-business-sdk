export type BusinessPhoneNumber = {
	verified_name: "Jasper's Market";
	display_phone_number: "+1 631-555-5555";
	id: "1906385232743451";
	quality_rating: "GREEN";
};

export type GetBusinessPhoneNumberResponse = {
	data: BusinessPhoneNumber[];
};

export type RequestPhoneNumberVerificationCodePayload = {
	code_method: "SMS" | "VOICE";
	/**
	 * Your locale. For example: "en_US".
	 */
	locale: string;
};
