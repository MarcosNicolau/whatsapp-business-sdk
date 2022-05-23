export type RegisterPhonePayload = {
	messaging_product: "whatsapp";
	/**
	 * A 6-digit pin you have previously set up
	 */
	pin: string;
};

export type RegisterPhoneArgs = Omit<RegisterPhonePayload, "messaging_product"> & {
	phoneNumberId: string;
};

export type SetUpTwoFactorAuthPayload = {
	pin: string;
};

export type SetUpTwoFactorAuthArgs = SetUpTwoFactorAuthPayload & { phoneNumberId: string };
