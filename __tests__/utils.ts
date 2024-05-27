import {
	Webhook,
	WebhookContact,
	WebhookError,
	WebhookMessage,
	WebhookStatus,
} from "./../src/types/webhooks";
import { DefaultResponse } from "./../src/types/response";
import { WABAErrorAPI } from "../src/types";

export const matchesWABAErrorObject = (err: any) =>
	expect(err).toEqual<WABAErrorAPI>(
		expect.objectContaining({
			code: expect.any(Number),
			message: expect.any(String),
			fbtrace_id: expect.any(String),
			type: expect.any(String),
			error_data: expect.objectContaining({
				details: expect.any(String),
				messaging_product: expect.any(String),
			}),
			error_subcode: expect.any(Number),
		})
	);

export const expectDefaultResponse = (data: any) =>
	expect(data).toEqual(expect.objectContaining<DefaultResponse>({ success: true }));

//This object is a mock of the body that the webhook listener receives. It is used to testing the webhookHandler

export const webhookBodyFields: {
	contact: WebhookContact;
	textMessage: WebhookMessage;
	message: WebhookMessage;
	status: WebhookStatus;
	error: WebhookError;
} = {
	contact: { profile: { name: "" }, wa_id: "" },
	textMessage: {
		type: "text",
		from: "",
		id: "32",
		timestamp: "21",
		text: {
			body: "Hi",
		},
	},
	message: {
		type: "audio",
		from: "",
		id: "32",
		timestamp: "21",
		text: {
			body: "Hi",
		},
	},
	status: {
		conversation: {
			id: "",
			origin: {
				type: "authentication",
			},
			expiration_timestamp: "",
		},
		id: "",
		pricing: {
			category: "authentication",
			pricing_model: "",
		},
		biz_opaque_callback_data: "",
		recipient_id: "",
		status: "read",
		timestamp: "465",
	},
	error: { code: 2, title: "ERR", message: "ERR", error_data: { details: "" } },
};

export const webhookBody: Webhook = {
	object: "whatsapp",
	entry: [
		{
			changes: [
				{
					field: "",
					value: {
						contacts: [webhookBodyFields.contact],
						messages: [webhookBodyFields.textMessage, webhookBodyFields.message],
						statuses: [webhookBodyFields.status, webhookBodyFields.status],
						errors: [webhookBodyFields.error, webhookBodyFields.error],
						messaging_product: "whatsapp",
						metadata: { display_phone_number: "", phone_number_id: "" },
					},
				},
			],
			id: "",
		},
	],
};
