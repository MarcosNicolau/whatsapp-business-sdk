import { createRestClient } from "../../src/utils/restClient";

type Methods = "get" | "post" | "put" | "delete";

describe("create rest client", () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it("should return CRUD methods and be callable", () => {
		const restClient = createRestClient({});
		jest.spyOn(restClient, "get");
		jest.spyOn(restClient, "post");
		jest.spyOn(restClient, "put");
		jest.spyOn(restClient, "delete");
		const call = (method: Methods) =>
			restClient[method](
				"hello",
				{ data: {} },
				{ headers: { "Content-Type": "multipart/form-data" } }
			);
		const methods: Methods[] = ["get", "post", "put", "delete"];

		//Iterative trough each method
		methods.forEach((method) => {
			//make a facke api call
			call(method);
			//And make sure it was called with the right params
			expect(restClient[method]).toHaveBeenCalledWith(
				"hello",
				{ data: {} },
				{ headers: { "Content-Type": "multipart/form-data" } }
			);
		});
	});

	it("should use error handler", async () => {
		const errorReturn = { request: {}, response: {} };
		const restClient = createRestClient({ errorHandler: () => Promise.reject(errorReturn) });
		try {
			await restClient.get("");
		} catch (err) {
			expect(err).toEqual(errorReturn);
		}
	});

	it("should use API Token and Base URL", () => {
		const args = {
			apiToken: "123456",
			baseURL: "hola",
		};
		const restClient = createRestClient(args);
		expect(restClient.fetch.defaults.headers.authorization).toBe("Bearer 123456");
		expect(restClient.fetch.defaults.baseURL).toBe("hola");
	});
});
