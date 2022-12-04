import express, { Router, json, urlencoded } from "express";
import { WebhookEvents } from "../types";
import { getWebhookController, postWebhookController } from "./helpers";

export interface WebhookClientArgs {
	/**
	 * Use this option if you want to use your own express application
	 */
	expressApp?: {
		app: express.Application;
		/**
		 * If the app should start listening on the specified port when initializing the webhook router.
		 */
		shouldStartListening: boolean;
	};
	/**
	 * The server port, defaults to: 8080
	 */
	port?: number;
	/**
	 * the url for the endpoint, example: { "path": "/whatsapp/business" }.
	 *
	 * if not provided will default to: "/webhook".
	 */
	path?: string;
	/**
	 * The token you provided for this endpoint. It is used to authenticate the webhook.
	 */
	token: string;
}

/**
 * Use this client if you want to easily initialize webhook connections.
 * Before anything, make sure your server has an https connection.
 * For more info, check the docs: https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks
 */
export class WebhookClient {
	private path: string;
	private port: number;
	private token: string;
	protected router: Router;
	expressApp?: WebhookClientArgs["expressApp"];

	constructor({ path, port, expressApp, token }: WebhookClientArgs) {
		this.path = path || "/webhook";
		this.port = port || 8080;
		this.router = Router();
		this.token = token;
		if (expressApp) this.expressApp = expressApp;
	}

	/**
	 * Initializes the webhook listener server with the provided events.
	 */
	initWebhook(events?: WebhookEvents) {
		//If the express app param is not passed, then create a general application
		if (!this.expressApp) {
			this.expressApp = {
				app: express(),
				shouldStartListening: true,
			};
			this.expressApp.app.use(json());
			this.expressApp.app.use(urlencoded({ extended: false }));
		}

		//Webhook subscription
		this.router.get("/", getWebhookController(this.token));

		//Listen to the webhook events
		this.router.post("/", postWebhookController(events || {}));

		//Route requests
		this.expressApp.app.use(this.path, this.router);

		//Start listening
		if (this.expressApp.shouldStartListening)
			this.expressApp.app.listen(this.port, events?.onStartListening);
	}
}
