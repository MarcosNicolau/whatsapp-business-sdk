![GitHub Workflow Status](https://img.shields.io/github/workflow/status/MarcosNicolau/whatsapp-business-sdk/Release)
![GitHub last commit](https://img.shields.io/github/last-commit/MarcosNicolau/whatsapp-business-sdk)
![npm](https://img.shields.io/npm/v/whatsapp-business)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/whatsapp-business)
![GitHub](https://img.shields.io/github/license/MarcosNicolau/whatsapp-business-sdk)
![GitHub top language](https://img.shields.io/github/languages/top/MarcosNicolau/whatsapp-business-sdk)

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

## Support

| Cloud API                                     | Business Management API | Analytics API                  |
| --------------------------------------------- | ----------------------- | ------------------------------ |
| <ul><li>- [x] Business profiles endpoints     | Currently working on    | Planning to add future support |
| <ul><li>- [x] Media endpoints                 |                         |
| <ul><li>- [x] Message endpoints               |                         |
| <ul><li>- [x] Phone Numbers endpoints         |
| <ul><li>- [x] Registration endpoints          |                         |
| <ul><li>- [x] Two-Step-Verification endpoints |                         |
| <ul><li>- [x] Webhooks types                  |                         |

### Webhooks

Although there is no current support for managing webhooks from the API, you can access the Webhooks response types

```typescript
import { Webhook } from "whatsapp-business";

const webhookListener = (res: Webhook) => {};
```

# Project

## Structure

This project uses typescript. Resources are stored in 2 key structures:

-   <b>src</b>: the whole connector written in typescript
-   <b>dist</b> the packed bundle of the project for use in browser environments.

## Contribution and thanks

Contributions are encouraged, I will review any incoming pull requests.

### Donations

If you found this project interesting or useful, you can give this project a star. Thank you!

Or buy me a coffee using any of these:

-   BTC: `1MjRd2YNNjEx3ze1Y71UNSgbAF9XECKTP1`
-   ETH: `0xde25d72e9e87513b9c8dad8de11e2d8332276c7e`
-   USDC:`0xde25d72e9e87513b9c8dad8de11e2d8332276c7e`
