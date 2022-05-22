import { DefaultResponse } from "types/response";
import {
	BusinessProfile,
	BusinessProfileFieldsQuery,
	UpdateBusinessProfilePayload,
	BusinessProfileFields,
} from "./types/business";
import { GetMediaResponse, UploadMediaPayload, UploadMediaResponse } from "./types/media";
import { createRestClient } from "./utils/restClient";
import fs from "fs";
import { Message, SendMessageResponse } from "types/messages";

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
	/*
	 *
	 * MEDIA ENDPOINTS
	 *
	 */
	uploadMedia(payload: Omit<UploadMediaPayload, "messaging_product">) {
		return this.restClient.post<UploadMediaResponse, UploadMediaPayload>(
			`/${this.phoneId}/media`,
			{
				...payload,
				messaging_product: "whatsapp",
			}
		);
	}

	getMedia(id: string) {
		return this.restClient.get<GetMediaResponse>(`/${this.phoneId}/${id}`);
	}
	deleteMedia(id: string) {
		this.restClient.delete<DefaultResponse>(`/${this.phoneId}/${id}`);
	}
	/**
	 *
	 * @param url your media’s URL
	 * @param pathToSaveFile the path where you want to store the media
	 */
	async downloadMedia(url: string, pathToSaveFile: string) {
		const response = await this.restClient.get(
			"",
			{},
			{ baseURL: url, responseType: "stream" }
		);
		return response.pipe(fs.createWriteStream(pathToSaveFile));
	}
	/*
	 *
	 * MESSAGES ENDPOINTS
	 *
	 */

	/**
	 * I suggest checking https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages to get some examples and understand how this endpoints works
	 */
	async sendMessage(payload: Omit<Message, "messaging_product">) {
		return this.restClient.post<SendMessageResponse, Message>(`/${this.phoneId}/messages`, {
			...payload,
			messaging_product: "whatsapp",
		});
	}
}
