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
} from "./types";
import { WABAErrorHandler } from "./utils/errorHandler";
import { createRestClient } from "./utils/restClient";

interface WABAClientArgs {
	apiToken: string;
	phoneId: string;
	accountId: string;
}

export class WABAClient {
	private apiToken: string;
	restClient: ReturnType<typeof createRestClient>;
	phoneId: string;
	accountId: string;

	constructor({ apiToken, phoneId, accountId }: WABAClientArgs) {
		this.apiToken = apiToken;
		this.phoneId = phoneId;
		this.accountId = accountId;
		this.restClient = createRestClient({
			apiToken,
			baseURL: "https://graph.facebook.com/v13.0",
			errorHandler: (error) => WABAErrorHandler(error?.response?.data || error),
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
		return this.restClient.get<BusinessProfile>(`${this.phoneId}/whatsapp_business_profile`, {
			fields:
				fields?.join(",") ||
				"about,address,description,email,profile_picture_url,websites,vertical",
		});
	}
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
	 * MEDIA ENDPOINTS
	 *
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
	getMedia(id: string) {
		return this.restClient.get<GetMediaResponse>(id);
	}
	deleteMedia(id: string) {
		return this.restClient.delete<DefaultResponse>(id);
	}
	/**
	 *
	 * @param url your media’s URL
	 * @param pathToSaveFile the path where you want to store the media
	 */
	async downloadMedia(url: string, pathToSaveFile: string) {
		try {
			const response = await this.restClient.get(
				url,
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
	 * MESSAGES ENDPOINTS
	 *
	 */

	/**
	 * I suggest checking https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages to get some examples and understand how this endpoints works
	 */
	async sendMessage(payload: Omit<Message, "messaging_product">) {
		return this.restClient.post<SendMessageResponse, Message>(`${this.phoneId}/messages`, {
			...payload,
			messaging_product: "whatsapp",
		});
	}
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
	 *	PHONE NUMBERS ENDPOINTS
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
}
