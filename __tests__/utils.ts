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
