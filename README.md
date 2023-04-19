![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/MarcosNicolau/whatsapp-business-sdk/npm_publish.yml?branch=main)
![Known Vulnerabilities](https://snyk.io/test/github/MarcosNicolau/whatsapp-business-sdk/badge.svg)
![Codecov](https://img.shields.io/codecov/c/github/MarcosNicolau/whatsapp-business-sdk?token=G20JHIZMRW)
![GitHub last commit](https://img.shields.io/github/last-commit/MarcosNicolau/whatsapp-business-sdk)
![GitHub top language](https://img.shields.io/github/languages/top/MarcosNicolau/whatsapp-business-sdk)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/whatsapp-business)
![npm](https://img.shields.io/npm/v/whatsapp-business)
![GitHub](https://img.shields.io/github/license/MarcosNicolau/whatsapp-business-sdk)

# WhatsApp Business API SDK

Node.js connector for WhatsApp Business Cloud API, with TypeScript support.

This project offers a solution to easily interact with WhatsApp Business Cloud API with Heavy integration testing with real API calls to support implementation stability. Built with Axios and no other extra dependency!

The connector is fully typed, tested and documented!

## Installation

`npm install whatsapp-business`

`yarn add whatsapp-business`

## Documentation

Most methods accept JS objects. These can be populated using parameters specified by [WhatsApp's API documentation](https://developers.facebook.com/docs/whatsapp/cloud-api/overview) or following the typescript schema.

# Usage

### Basic usage

```typescript
import { WABAClient, WABAErrorAPI } from "whatsapp-business";

//You cant get it from the meta for developers app administration
const client = new WABAClient({
	accountId: "<YOUR_ACCOUNT_ID>",
	apiToken: "<YOUR_API_TOKEN>",
	phoneId: "<YOUR_BUSINESS_PHONE_ID>",
});

const foo = async () => {
	try {
		const res = await client.getBusinessPhoneNumbers();
		console.log(res);
	} catch (err) {
		const error: WABAErrorAPI = err;
		console.error(error.message);
	}
};

foo();
```

### Sending messages

You can send a text message

```typescript
const sendTextMessage = async (body: string, to: string) => {
	try {
		const res = await client.sendMessage({ to, type: "text", text: { body } });
		console.log(res);
	} catch (err) {
		const error: WABAErrorAPI = err;
		console.error(error.message);
	}
};
```

or an image

```typescript
const sendPictureMessage = async ({ link, caption }: MediaObject, to: string) => {
	try {
		const res = await client.sendMessage({ to, type: "image", image: { link, caption } });
		console.log(res);
	} catch (err) {
		const error: WABAErrorAPI = err;
		console.error(error.message);
	}
};

sendPictureMessage(
	{ link: "<url_link_to_your_image>", caption: "<image_description>" },
	"<PHONE_NUMBER>"
);
```

### Webhooks

The webhook client will handle the subscription and setup for the webhooks. You must have an HTTPS connection and add the server URL in your application management.

For more info, checks the docs [here](https://developers.facebook.com/docs/whatsapp/business-management-api/guides/set-up-webhooks).

```typescript
import { WebhookClient, WABAClient } from "./index";

//The token and path must match the values you set on the application management
const webhookClient = new WebhookClient({
	token: "<YOUR_VALIDATION_TOKEN>",
	path: "/whatsapp/webhook",
	port: 8080,
});

const wabaClient = new WABAClient({
	accountId: "<ACCOUNT_ID>",
	phoneId: "<PHONE_ID>",
	apiToken: "<API_TOKEN>",
});

//Starts a server and triggers the received functions based on the webhook event type
webhookClient.initWebhook({
	onStartListening: () => {
		console.log("Server started listening");
	},
	onTextMessageReceived: async (payload, contact) => {
		try {
			const messageId = payload.id.toString();
			const contactNumber = contact.wa_id;
			//Mark message as read
			await wabaClient.markMessageAsRead(messageId);
			//React to message
			await wabaClient.sendMessage({
				to: contactNumber,
				type: "reaction",
				reaction: { message_id: messageId, emoji: "😄" },
			});
			//Respond to message
			await wabaClient.sendMessage({
				type: "text",
				to: contactNumber,
				text: { body: "Ok!" },
				//This is optional, it enables reply-to feature
				context: {
					message_id: messageId,
				},
			});
		} catch (err) {
			console.log(err);
		}
	},
});
```

You can also provide your own express app:

```typescript
import { WebhookClient } from "./index";
import express from "express";

const myApp = express();

const webhookClient = new WebhookClient({
	token: "<YOUR_VALIDATION_TOKEN>",
	path: "/whatsapp/webhook",
	expressApp: {
		//Set to false if you want to initialize the server yourself
		//Otherwise, it will start listening when firing initWebhook()
		shouldStartListening: false,
		app: myApp,
	},
});

myApp.listen(8080, () => {
	console.log("My server nows listens to whatsapp webhooks");
});
```

If you don't provide a express app the client will create a default app on its own, which you can later access:

```typescript
import { WebhookClient } from "./index";

const webhookClient = new WebhookClient({
	token: "<YOUR_VALIDATION_TOKEN>",
	path: "/whatsapp/webhook",
	port: 8080,
});

const app = webhookClient.expressApp.app;
//Your configuration...
app.set("trust proxy", true);

webhookClient.initWebhook({
	onStartListening: () => {
		console.log("Server started listening");
	},
});
```

## Support

| Cloud API                                     |
| --------------------------------------------- |
| <ul><li>- [x] Business profiles endpoints     |
| <ul><li>- [x] Media endpoints                 |
| <ul><li>- [x] Message endpoints               |
| <ul><li>- [x] Phone Numbers endpoints         |
| <ul><li>- [x] Registration endpoints          |
| <ul><li>- [x] Two-Step-Verification endpoints |

| Webhooks                          |
| --------------------------------- |
| <ul><li>- [x] Cloud API           |
| <ul><li>- [ ] Business Management |

| Business Management API |
| ----------------------- |
| Currently working on    |

| Analytics API                  |
| ------------------------------ |
| Planning to add future support |

# Project

## Structure

This project uses typescript. Resources are stored in 2 key structures:

-   <b>src</b>: the whole connector written in typescript
-   <b>dist</b> the packed bundle of the project for use in nodejs environments (generated when running yarn run build).
-   <b>\_\_tests\_\_</b> all the tests for the connector

## Contribution and thanks

Contributions are encouraged, I will review any incoming pull requests.

If you found this project interesting or useful, you would help so much by giving this project a star. Thank you!
