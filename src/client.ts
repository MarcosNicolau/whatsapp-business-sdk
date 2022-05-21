import { DefaultResponse } from "types/response";
import {
	BusinessProfile,
	BusinessProfileFieldsQuery,
	UpdateBusinessProfilePayload,
	BusinessProfileFields,
} from "./types/business";
import { createRestClient } from "./utils/restClient";

interface WABAClientArgs {
	apiToken: string;
	phoneId: string;
}

export class WABAClient {
	private apiToken: string;
	restClient: ReturnType<typeof createRestClient>;
	phoneId: string;

	constructor({ apiToken, phoneId }: WABAClientArgs) {
		this.apiToken = apiToken;
		this.phoneId = phoneId;
		this.restClient = createRestClient({
			apiToken,
			baseURL: "https://graph.facebook.com/v13.0",
		});
	}

	/*
	 *
	 *BUSINESS PROFILE ENDPOINTS
	 *
	 */
	/**
	 *
	 * @param fields you can specify what you want to know from your business. If not passed, defaults to all fields
	 */
	getBusinessProfile(fields?: BusinessProfileFieldsQuery) {
		return this.restClient.get<BusinessProfile>(`/${this.phoneId}/whatsapp_business_profile`, {
			fields:
				fields?.join(",") ||
				"about,address,description,email,profile_picture_url,websites,vertical",
		});
	}
	updateBusinessProfile(payload: UpdateBusinessProfilePayload) {
		return this.restClient.post<DefaultResponse, Partial<BusinessProfileFields>>(
			`/${this.phoneId}/whatsapp_business_profile`,
			{
				...payload,
				messaging_product: "whatsapp",
			}
		);
	}
}
