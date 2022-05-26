export type BusinessVertical =
	| "UNDEFINED"
	| "OTHER"
	| "AUTO"
	| "BEAUTY"
	| "APPAREL"
	| "EDU"
	| "ENTERTAIN"
	| "EVENT_PLAN"
	| "FINANCE"
	| "GROCERY"
	| "GOVT"
	| "HOTEL"
	| "HEALTH"
	| "NONPROFIT"
	| "PROF_SERVICES"
	| "RETAIL"
	| "TRAVEL"
	| "RESTAURANT"
	| "NOT_A_BIZ";

export type BusinessProfileFields = {
	messaging_product: string;
	address: string;
	description: string;
	vertical: BusinessVertical;
	email: string;
	websites: string[];
	profile_picture_url: string;
	id: string;
};

export type BusinessProfile = {
	data: BusinessProfileFields[];
};

export type BusinessProfileFieldsQuery = (keyof BusinessProfileFields)[];

export type UpdateBusinessProfilePayload = Partial<
	Omit<BusinessProfileFields, "messaging_product" | "id">
>;
