import { Webhook, WebhookEvents } from "../types";
import { Request, Response } from "express";

export const webhookHandler = (
	body: Webhook,
	{
		onError,
		onMessageReceived,
		onStatusReceived,
		onTextMessageReceived,
	}: Omit<WebhookEvents, "onStartListening">
) => {
	body.entry?.forEach((entry) => {
		entry?.changes?.forEach((change) => {
			//Generally, if not always, the message is just the index 0
			//But, since the docs don't say anything, we do it through a loop
			change?.value?.messages?.forEach((message) => {
				//The contact is always the 0 and it is only received when there the messages field is present
				const contact = change?.value?.contacts[0];
				//Call message event
				onMessageReceived && onMessageReceived(message, contact, change?.value?.metadata);
				//If the message is type of text, then call the respective event
				if (message.type === "text" && message.text)
					onTextMessageReceived &&
						onTextMessageReceived(
							{
								id: message.id,
								type: message.type,
								text: message.text,
								from: message.from,
								timestamp: message.timestamp,
							},
							contact,
							change?.value?.metadata,
						);
			});
			//Call status event
			change?.value?.statuses?.forEach((status) => {
				onStatusReceived && onStatusReceived(status, change?.value?.metadata);
			});
			//Call error event
			change?.value?.errors?.forEach((err) => onError && onError(err));
		});
	});
};

export const postWebhookController = (events: WebhookEvents) => (req: Request, res: Response) => {
	webhookHandler(req.body, events);
	return res.send("success");
};

export const getWebhookController = (token: string) => (req: Request, res: Response) => {
	if (req.query["hub.mode"] == "subscribe" && req.query["hub.verify_token"] == token) {
		try {
			return res.send(req.query["hub.challenge"]);
		} catch (err) {
			console.error("Could not subscribe to the webhook", `err: ${JSON.stringify(err)}`);
		}
	}
	return res.sendStatus(400);
};
