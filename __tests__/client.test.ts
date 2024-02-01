import path from "path";
import { WABAClient } from "../src/WABA_client";
import {
	BusinessPhoneNumber,
	ERROR_CODES,
	GetMediaResponse,
	SendMessageResponse,
	UploadMediaResponse,
} from "../src/types";
import { WABAErrorAPI } from "../src/types/error";
import { expectDefaultResponse, matchesWABAErrorObject } from "./utils";

describe("WABA Cloud API endpoints", () => {
	const args = {
		accountId: process.env.ACCOUNT_ID || "",
		apiToken: process.env.API_TOKEN || "",
		phoneId: process.env.PHONE_ID || "",
	};

	const client = new WABAClient(args);

	it("matches error object", async () => {
		const client = new WABAClient({ accountId: "", apiToken: "", phoneId: "" });
		try {
			await client.getBusinessProfile();
		} catch (err) {
			return matchesWABAErrorObject(err);
		}
	});

	describe("Business endpoints", () => {
		it("get profile", async () => {
			const res = await client.getBusinessProfile();
			expect(res).toEqual({
				data: expect.arrayContaining([
					expect.objectContaining({
						address: expect.any(String),
						description: expect.any(String),
						email: expect.any(String),
						messaging_product: expect.any(String),
						vertical: expect.any(String),
						websites: expect.arrayContaining([expect.any(String)]),
					}),
				]),
			});
		});

		it("update profile", async () => {
			const res = await client.updateBusinessProfile({
				address: "No physical address",
				description: "A profile to test",
				email: "marcosnicolau2003@gmail.com",
				vertical: "ENTERTAIN",
				websites: ["https://github.com/MarcosNicolau/whatsapp-business-sdk"],
			});
			expectDefaultResponse(res);
		});
	});

	describe("media endpoints", () => {
		let mediaId = "";
		let mediaUrl = "";

		it("upload media", async () => {
			const res = await client.uploadMedia({
				file: path.resolve(__dirname, "testUpload.txt"),
				type: "text/plain",
			});
			mediaId = res.id;
			expect(res).toEqual(
				expect.objectContaining<UploadMediaResponse>({
					id: expect.any(String),
				})
			);
		});

		it("get media", async () => {
			const res = await client.getMedia(mediaId);
			mediaUrl = res.url;
			expect(res).toEqual(
				expect.objectContaining<GetMediaResponse>({
					file_size: expect.any(Number),
					id: expect.any(String),
					messaging_product: "whatsapp",
					mime_type: expect.any(String),
					sha256: expect.any(String),
					url: expect.any(String),
				})
			);
		});

		it("download media", async () => {
			const res = await client.downloadMedia(
				mediaUrl,
				path.resolve(__dirname, "testDownload.txt")
			);
			expect(res).toBeTruthy();
		});

		it("delete media", async () => {
			const res = await client.deleteMedia(mediaId);
			expectDefaultResponse(res);
		});
	});

	describe("message endpoints", () => {
		it("sends a text message", async () => {
			const res = await client.sendMessage({
				to: process.env.MESSAGE_TO || "",
				type: "text",
				text: { body: "This message was sent from a test environment" },
			});
			expect(res).toEqual(
				expect.objectContaining<SendMessageResponse>({
					contacts: expect.arrayContaining([
						expect.objectContaining<SendMessageResponse["contacts"][0]>({
							input: expect.any(String),
							wa_id: expect.any(String),
						}),
					]),
					messages: expect.arrayContaining([
						expect.objectContaining<SendMessageResponse["messages"][0]>({
							id: expect.any(String),
						}),
					]),
					messaging_product: "whatsapp",
				})
			);
		});

		it("marks message as read", async () => {
			try {
				const res = await client.markMessageAsRead(
					"wamid.HBgNNTQ5MTEyMTc5NjMwNBUCABEYEjJGNjE1QzQ2RjRFQUI4MUVCMAA="
				);
				expectDefaultResponse(res);
			} catch (err: any) {
				//The message id passed is not real.
				//So to test that the endpoints is working we just compare with the err message
				expect(err).toMatchObject<Partial<WABAErrorAPI>>({
					code: 100,
					message: ERROR_CODES[100],
				});
			}
		});
	});

	describe("phone number endpoints", () => {
		const businessPhone = expect.objectContaining<BusinessPhoneNumber>({
			display_phone_number: expect.any(String),
			id: expect.any(String),
			quality_rating: expect.any(String),
			verified_name: expect.any(String),
			code_verification_status: expect.any(String),
		});

		it("get business phones", async () => {
			const res = await client.getBusinessPhoneNumbers();
			expect(res).toEqual(
				expect.objectContaining({ data: expect.arrayContaining([businessPhone]) })
			);
		});

		it("get single business phone", async () => {
			const res = await client.getSingleBusinessPhoneNumber(args.phoneId);
			expect(res).toEqual(businessPhone);
		});

		it("update identity check state", async () => {
			const res = await client.updateIdentityCheckState({ enable_identity_key_check: false });
			expectDefaultResponse(res);
		});

		it("deregister phone", async () => {
			const res = await client.deregisterPhone(args.phoneId);
			expectDefaultResponse(res);
		});

		it("request phone number verification code", async () => {
			try {
				const res = await client.requestPhoneNumberVerificationCode({
					language: "en_US",
					code_method: "SMS",
					phoneNumberId: args.phoneId,
				});
				expectDefaultResponse(res);
			} catch (err) {
				//This endpoints tends to fail
				//So we match the error object
				matchesWABAErrorObject(err);
			}
		});

		it("verify phone number call", async () => {
			try {
				const res = await client.verifyPhoneNumberCode({
					code: "123456",
					phoneNumberId: args.phoneId,
				});
				expectDefaultResponse(res);
			} catch (err) {
				//We cant verify with the real code
				//So we just make sure that the API call was made
				expect(err).toMatchObject<Partial<WABAErrorAPI>>({
					message: ERROR_CODES[136025],
					code: 136025,
				});
			}
		});

		it("register phone", async () => {
			const res = await client.registerPhone({
				phoneNumberId: args.phoneId,
				pin: "123456",
			});
			expectDefaultResponse(res);
		});

		it("set up two step auth", async () => {
			const res = await client.setupTwoStepAuth({
				phoneNumberId: args.phoneId,
				pin: "123456",
			});
			expectDefaultResponse(res);
		});
	});

	describe("health endpoints", () => {
		it("health status", async () => {
			const res = await client.getHealthStatus("100799079318472");
			expect(res).toEqual({
				health_status: expect.objectContaining({
					can_send_message: expect.any(String),
					entities: expect.arrayContaining([
						expect.objectContaining({
							id: expect.any(String),
							entity_type: expect.any(String),
							can_send_message: expect.any(String),
						}),
					]),
				}),
				id: expect.any(String),
			});
		});
	});
});
