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
	accountId: "YOUR_ACCOUNT_ID",
	apiToken: "YOUR_API_TOKEN",
	phoneId: "YOUR_BUSINESS_PHONE_ID",
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

### Sending a message

```typescript
const sendTextMessage = async (body: string, to: string) => {
	try {
		const res = await client.sendMessage({ type: "text", text: { body }, to });
		console.log(res);
	} catch (err) {
		const error: WABAErrorAPI = err;
		console.error(error.message);
	}
};
```

### Webhooks

The webhook client will handle the subscription and setup for the webhooks. You must have an HTTPS connection and add the server URL in your application management.

For more info, checks the docs [here](https://developers.facebook.com/docs/whatsapp/business-management-api/guides/set-up-webhooks)

```typescript
import { WebhookClient, WABAClient } from "./index";

//The token and path must match the values you set on the application management
const webhookClient = new WebhookClient({
	token: "YOUR_VALIDATION_TOKEN",
	path: "/whatsapp/business",
});
const wabaClient = new WABAClient({
	accountId: "ACCOUNT_ID",
	phoneId: "PHONE_ID",
	apiToken: "API_TOKEN",
});

//init webhooks takes an object of functions that will be triggered based on the received webhook event type
webhookClient.initWebhook({
	onTextMessageReceived: async (payload, contact) => {
		try {
			await waba_client.markMessageAsRead(payload.id.toString());
			await waba_client.sendMessage({
				type: "text",
				to: contact.wa_id,
				text: { body: "Ok!" },
			});
		} catch (err) {
			console.log(err);
		}
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

### Donations

If you found this project interesting or useful, you can give this project a star. Thank you!

Or buy me a coffee using any of these:

-   BTC: `1MjRd2YNNjEx3ze1Y71UNSgbAF9XECKTP1`
-   ETH: `0xde25d72e9e87513b9c8dad8de11e2d8332276c7e`
-   USDC:`0xde25d72e9e87513b9c8dad8de11e2d8332276c7e`
