import { DefaultWABAErrorAPI, ERROR_CODES } from "../../src/types";
import { WABAErrorHandler } from "../../src/utils/errorHandler";

describe("Cloud API error handler", () => {
	it("should handle API errors", async () => {
		const error: DefaultWABAErrorAPI = {
			error: {
				code: 0,
				fbtrace_id: "",
				message: ERROR_CODES[0],
				type: "",
				error_data: { details: "", messaging_product: "whatsapp" },
				error_subcode: NaN,
			},
		};
		try {
			await WABAErrorHandler(error);
		} catch (err) {
			expect(err).toEqual(error.error);
		}
	});

	it("should throw unparsed error when passed arg does not match the Cloud API schema", async () => {
		const error = {
			request: {},
			response: {},
		};
		try {
			//@ts-expect-error we are purposely passing a different error
			await WABAErrorHandler(error);
		} catch (err) {
			expect(err).toEqual(error);
		}
	});
});
