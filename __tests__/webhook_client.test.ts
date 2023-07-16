import { mockRequest, mockResponse } from "./mocks/express";
import express, { json, urlencoded } from "express";
import { WebhookClient, WebhookClientArgs } from "./../src/webhooks/client";
import {
	getWebhookController,
	postWebhookController,
	webhookHandler,
} from "../src/webhooks/helpers";
import { webhookBody, webhookBodyFields } from "./utils";
import { WebhookEvents } from "../src/types";

describe("Webhook Client tests", () => {
	const port = 5000;
	const path = "/webhook";
	const events: WebhookEvents = {
		onError: jest.fn(),
		onMessageReceived: jest.fn(),
		onStartListening: jest.fn(),
		onStatusReceived: jest.fn(),
		onTextMessageReceived: jest.fn(),
	};
	const startWebhook = ({ token, expressApp, port, path }: WebhookClientArgs) => {
		const client = new WebhookClient({
			token,
			path,
			port,
			expressApp,
		});

		client.initWebhook(events);
		return client;
	};

	const getWebhookRouter = ({ token, expressApp, port, path }: WebhookClientArgs) => {
		// Extending the client to get access to the router protected member
		class Router extends WebhookClient {
			getRouter() {
				this.initWebhook(events);
				return this.router;
			}
		}
		return new Router({
			port,
			path,
			token,
			expressApp,
		}).getRouter();
	};

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it("should start server with the provided params and use the provided express app", () => {
		const app = express();
		startWebhook({ port, path, token: "", expressApp: { app, shouldStartListening: true } });
		expect(app.listen).toHaveBeenCalledWith(port, events.onStartListening);
		expect(events.onStartListening).toHaveBeenCalled();
	});

	it("should not start listening if set", () => {
		const app = express();
		startWebhook({ port, path, token: "", expressApp: { app, shouldStartListening: false } });
		expect(app.listen).not.toHaveBeenCalled();
	});

	it("should initialize a default server if the express app is not provided", () => {
		const client = startWebhook({ token: "" });
		//We check if the server has been created by checking if the necessary fns to create the server were called
		expect(express).toHaveBeenCalled();
		expect(json).toHaveBeenCalled();
		expect(urlencoded).toHaveBeenCalledWith({ extended: false });
		expect(client.expressApp?.shouldStartListening).toBeTruthy();
	});

	it("should use the router", () => {
		const app = express();
		const router = getWebhookRouter({
			token: "",
			expressApp: { app, shouldStartListening: false },
		});
		expect(app.use).toHaveBeenCalledWith(path, router);
	});

	it("router GET and POST should be called with their appropriate controllers", () => {
		//Create a spy on the controllers
		const module = jest.requireActual("../src/webhooks/helpers.ts");
		jest.spyOn(module, "getWebhookController").mockImplementation(jest.fn((token) => token));
		jest.spyOn(module, "postWebhookController").mockImplementation(jest.fn((events) => events));
		const token = "";
		const router = getWebhookRouter({ token });
		expect(router.get).toHaveBeenCalledWith("/", getWebhookController(token));
		expect(router.post).toHaveBeenCalledWith("/", postWebhookController(events));
	});

	it("webhook get controller should properly subscribe", () => {
		const token = "TOKEN";
		const res = mockResponse();
		const req = mockRequest();
		req.query["hub.mode"] = "subscribe";
		req.query["hub.verify_token"] = token;
		req.query["hub.challenge"] = "CHALLENGE";
		getWebhookController(token)(req, res);

		expect(res.send).toHaveBeenCalledWith(req.query["hub.challenge"]);
	});

	it("webhook post controller", () => {
		const module = jest.requireActual("../src/webhooks/helpers.ts");
		jest.spyOn(module, "webhookHandler");
		const res = mockResponse();
		const req = mockRequest();
		postWebhookController(events)(req, res);
		expect(webhookHandler).toHaveBeenCalled();
		expect(res.send).toHaveBeenCalledWith("success");
	});

	it("webhook handler fires the events", () => {
		const body = webhookBody;
		const fields = webhookBodyFields;
		const contact = body.entry[0].changes[0].value.contacts[0];
		const metadata = body.entry[0].changes[0].value.metadata;

		webhookHandler(body, events);
		expect(events.onMessageReceived).toHaveBeenCalledTimes(2);
		expect(events.onError).toHaveBeenCalledTimes(2);
		expect(events.onStatusReceived).toHaveBeenCalledTimes(2);
		expect(events.onTextMessageReceived).toHaveBeenCalledTimes(1);
		expect(events.onMessageReceived).toHaveBeenCalledWith(fields.message, contact, metadata);
		expect(events.onTextMessageReceived).toHaveBeenCalledWith(
			fields.textMessage,
			contact,
			metadata
		);
		expect(events.onError).toHaveBeenCalledWith(fields.error);
		expect(events.onStatusReceived).toHaveBeenCalledWith(fields.status, metadata);
	});
});
