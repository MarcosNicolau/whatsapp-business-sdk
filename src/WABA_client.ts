import fs from "fs";
import FormData from "form-data";
import {
	Message,
	SendMessageResponse,
	GetBusinessPhoneNumberResponse,
	RequestPhoneNumberVerificationCodeArgs,
	RequestPhoneNumberVerificationCodePayload,
	VerifyPhoneNumberArgs,
	RegisterPhoneArgs,
	RegisterPhonePayload,
	SetUpTwoFactorAuthArgs,
	DefaultResponse,
	BusinessProfile,
	BusinessProfileFields,
	BusinessProfileFieldsQuery,
	UpdateBusinessProfilePayload,
	GetMediaResponse,
	UploadMediaPayload,
	UploadMediaResponse,
	MarkMessageAsReadPayload,
	BusinessPhoneNumber,
	UpdateIdentityCheckState,
	HealthStatusResponse,
} from "./types";
import { WABAErrorHandler } from "./utils/errorHandler";
import { createRestClient } from "./utils/restClient";

interface WABAClientArgs {
	apiToken: string;
	phoneId: string;
	accountId: string;
}

/**
 * Connector for the Whatsapp Cloud API.
 *
 * documentation: https://developers.facebook.com/docs/whatsapp/cloud-api/guides
 */
export class WABAClient {
	restClient: ReturnType<typeof createRestClient>;
	phoneId: string;
	accountId: string;

	constructor({ apiToken, phoneId, accountId }: WABAClientArgs) {
		this.phoneId = phoneId;
		this.accountId = accountId;
		this.restClient = createRestClient({
			apiToken,
			baseURL: "https://graph.facebook.com/v19.0",
			errorHandler: (error) => WABAErrorHandler(error?.response?.data || error),
		});
	}

	/*
	 *
	 *BUSINESS PROFILE ENDPOINTS (https://developers.facebook.com/docs/whatsapp/cloud-api/reference/business-profiles)
	 */
	/**
	 *
	 * Retrieves your business profile. Customers can view your business profile by clicking your business's name or number in a conversation thread.
	 *
	 * @param fields you can specify which data you want to get from your business. If not passed, defaults to all fields.
	 */
	getBusinessProfile(fields?: BusinessProfileFieldsQuery) {
		return this.restClient.get<BusinessProfile>(`${this.phoneId}/whatsapp_business_profile`, {
			fields:
				fields?.join(",") ||
				"about,address,description,email,profile_picture_url,websites,vertical",
		});
	}
	/**
	 * @param payload provide the fields that you wish to update.
	 */
	updateBusinessProfile(payload: UpdateBusinessProfilePayload) {
		return this.restClient.post<DefaultResponse, Partial<BusinessProfileFields>>(
			`${this.phoneId}/whatsapp_business_profile`,
			{
				...payload,
				messaging_product: "whatsapp",
			}
		);
	}
	/*
	 *
	 * MEDIA ENDPOINTS (https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media)
	 *
	 */
	/**
	 * All media files sent through this endpoint are encrypted and persist for 30 days, unless they are deleted earlier.
	 *
	 * A successful response returns an object with the uploaded media's ID.
	 */
	uploadMedia({ file, type }: Omit<UploadMediaPayload, "messaging_product">) {
		const formData = new FormData();
		formData.append("type", type);
		formData.append("file", fs.createReadStream(file));
		formData.append("messaging_product", "whatsapp");
		return this.restClient.post<UploadMediaResponse, FormData>(
			`${this.phoneId}/media`,
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);
	}
	/**
	 * Retrieves your media’s URL. Use the returned URL to download the media file. Note that clicking this URL (i.e. performing a generic GET) will not return the media; you must include an access token.
	 *
	 * A successful response includes an object with a media url. The URL is only valid for 5 minutes.
	 */
	getMedia(mediaId: string) {
		return this.restClient.get<GetMediaResponse>(mediaId);
	}
	deleteMedia(mediaId: string) {
		return this.restClient.delete<DefaultResponse>(mediaId);
	}
	/**
	 * @param mediaUrl your media’s URL
	 * @param pathToSaveFile the path where you want to store the media
	 */
	async downloadMedia(mediaUrl: string, pathToSaveFile: string) {
		try {
			const response = await this.restClient.get(
				mediaUrl,
				{},
				{ baseURL: "", responseType: "stream" }
			);
			return response.pipe(fs.createWriteStream(pathToSaveFile));
		} catch (err) {
			return Promise.reject(err);
		}
	}
	/*
	 *
	 * MESSAGES ENDPOINTS (https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages)
	 *
	 */

	/**
	 * Yu can use the API to send the following free-form messages types:
	 * 	Text
	 *	Reaction
	 * 	Media
	 * 	Location
	 * 	Contacts
	 * 	Interactive
	 * 	Address
	 * 	messages
	 * 	template
	 *
	 * For more information refer here: https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
	 *
	 * If you are working with template messages refer here: https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates
	 *
	 */
	async sendMessage(payload: Omit<Message, "messaging_product">) {
		return this.restClient.post<SendMessageResponse, Message>(`${this.phoneId}/messages`, {
			...payload,
			messaging_product: "whatsapp",
		});
	}
	/**
	 * When you receive an incoming message from Webhooks,
	 * you can use the /messages endpoint to mark the message as
	 * read by changing its status to read. Messages marked as read display two blue check marks alongside their timestamp.
	 */
	async markMessageAsRead(message_id: string) {
		return this.restClient.post<DefaultResponse, MarkMessageAsReadPayload>(
			`${this.phoneId}/messages`,
			{
				messaging_product: "whatsapp",
				status: "read",
				message_id,
			}
		);
	}
	/*
	 *
	 *	PHONE NUMBERS ENDPOINTS (https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers)
	 *
	 */
	async getBusinessPhoneNumbers() {
		return this.restClient.get<GetBusinessPhoneNumberResponse>(
			`${this.accountId}/phone_numbers`
		);
	}
	async getSingleBusinessPhoneNumber(phoneNumberId: string) {
		return this.restClient.get<BusinessPhoneNumber>(phoneNumberId);
	}
	/**
	 * You may want us to verify a customer's identity before we deliver your message to them.
	 * You can have us do this by enabling the identity change check setting on your business phone number.
	 */
	async updateIdentityCheckState({ enable_identity_key_check }: UpdateIdentityCheckState) {
		return this.restClient.post<DefaultResponse>(`${this.phoneId}/settings`, {
			user_identity_change: {
				enable_identity_key_check,
			},
		});
	}
	async requestPhoneNumberVerificationCode({
		phoneNumberId,
		...payload
	}: RequestPhoneNumberVerificationCodeArgs) {
		return this.restClient.post<DefaultResponse, RequestPhoneNumberVerificationCodePayload>(
			`${phoneNumberId}/request_code`,
			payload
		);
	}
	async verifyPhoneNumberCode({ phoneNumberId, ...payload }: VerifyPhoneNumberArgs) {
		return this.restClient.post<DefaultResponse>(`/${phoneNumberId}/verify_code`, payload);
	}
	async registerPhone({ phoneNumberId, ...payload }: RegisterPhoneArgs) {
		return this.restClient.post<DefaultResponse, RegisterPhonePayload>(
			`${phoneNumberId}/register`,
			{ messaging_product: "whatsapp", ...payload }
		);
	}
	async deregisterPhone(phoneNumber: string) {
		return this.restClient.post<DefaultResponse>(`${phoneNumber}/deregister`);
	}
	async setupTwoStepAuth({ phoneNumberId, ...payload }: SetUpTwoFactorAuthArgs) {
		return this.restClient.post<DefaultResponse>(phoneNumberId, payload);
	}
	/*
	 *
	 *	HEALTH ENDPOINTS (https://developers.facebook.com/docs/whatsapp/cloud-api/health-status)
	 *
	 */
	/**
	 *
	 * @param nodeId is optional, defaults to the account_id
	 */
	async getHealthStatus(nodeId?: string) {
		return this.restClient.get<HealthStatusResponse>(`${this.accountId}?fields=health_status`);
	}
}
