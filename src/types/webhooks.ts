import { WABAErrorCodes } from "./error";
import { MessageType, ReactionMessage } from "./messages";
import { LiteralUnion } from "./utils";

/**
 * The information for the customer who sent a message to the business
 */
export type WebhookContact = {
	/**
	 * The customer's WhatsApp ID. A business can respond to a message using this ID.
	 */
	wa_id: string;
	profile: {
		name: string;
	};
};

export type WebhookError = {
	code: WABAErrorCodes;
	title: string;
	message: string;
	error_data: {
		details: string;
	};
};

export type WebhookMedia = {
	/**
	 * Caption for the file, if provided
	 */
	caption?: string;
	/**
	 * Name for the file on the sender's device
	 */
	filename: string;
	ha256: string;
	mime_type: string;
	/**
	 * ID for the file
	 */
	id: string;
};

/**
 * For more information about this object, go here https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components#messages-object
 */
export type WebhookMessage = {
	/**
	 * The type of message that has been received by the business that has subscribed to Webhooks.
	 */
	type: MessageType | "system" | "unknown";
	/**
	 * The time when the customer sent the message to the business in unix format
	 */
	timestamp: number;
	/**
	 * When the messages type is set to audio, including voice messages, this object is included in the messages object:
	 */
	audio?: {
		id: string;
		mime_type: string;
	};
	/**
	 * When the messages type field is set to button, this object is included in the messages object:
	 */
	button?: {
		/**
		 * The payload for a button set up by the business that a customer clicked as part of an interactive message
		 */
		payload: string;
		text: string;
	};
	/**
	 * Context object. Only included when a user replies or interacts with one of your messages. Context objects can have the following properties
	 */
	context?: {
		/**
		 * Set to true if the message received by the business has been forwarded
		 */
		forwarded: boolean;
		/**
		 * Set to true if the message received by the business has been forwarded more than 5 times.
		 */
		frequently_forwarded: boolean;
		/**
		 * The WhatsApp ID for the customer who replied to an inbound message
		 */
		from: string;
		/**
		 * The message ID for the sent message for an inbound reply
		 */
		id: string;
		/**
		 * Referred product object describing the product the user is requesting information about. You must parse this value if you support Product Enquiry Messages
		 */
		referred_product: {
			catalog_id: string;
			product_retailer_id: string;
		};
	};
	/**
	 * When messages type is set to document.
	 */
	document?: WebhookMedia;
	/**
	 * The message that a business received from a customer is not a supported type.
	 */
	errors?: WebhookError[];
	/**
	 * The customer's WhatsApp ID. A business can respond to a customer using this ID.
	 * This ID may not match the customer's phone number, which is returned by the API as input when sending a message to the customer.
	 */
	from: string;
	/**
	 * The ID for the message that was received by the business. You could use messages endpoint to mark it as read.
	 */
	id: number;
	/**
	 * A webhook is triggered when a customer's phone number or profile information has been updated.
	 */
	identity?: {
		acknowledged: boolean;
		/**
		 * The time when the WhatsApp Business Management API detected the customer may have changed their profile information
		 */
		created_timestamp: string;
		/**
		 * The ID for the messages system customer_identity_changed
		 */
		hash: string;
	};
	/**
	 * When messages type is set to image, this object is included in the messages object.
	 * */
	image?: WebhookMedia;
	/**
	 * When a customer selected a button or list reply.
	 */
	interactive?: {
		type: {
			/**
			 * Sent when a customer clicks a button
			 */
			button_reply?: {
				/**
				 *  Unique ID of a button
				 */
				id: string;
				title: string;
			};
			/**
			 *  Sent when a customer selects an item from a list
			 */
			list_reply?: {
				/**
				 * Unique ID of the selected list item
				 */
				id: string;
				title: string;
				description: string;
			};
		};
	};
	/**
	 * Included in the messages object when a customer has placed an order. Order objects have the following properties:
	 */
	order?: {
		catalog_id: string;
		text: string;
		product_items: {
			product_retailer_id: string;
			quantity: string;
			item_price: string;
			currency: string;
		}[];
	};
	/**
	 * A customer clicked an ad that redirects them to WhatsApp.
	 *
	 * The referral object can be included in the following types of message: text, location, contact, image, video, document, voice, and sticker.
	 */
	referral?: {
		/**
		 *  The Meta URL that leads to the ad or post clicked by the customer. Opening this url takes you to the ad viewed by your customer.
		 */
		source_url: string;
		/**
		 * The type of the ad’s source; ad or post
		 */
		source_type: LiteralUnion<"ad" | "post">;
		/**
		 * Meta ID for an ad or a post
		 */
		source_id: string;
		headline: string;
		body: string;
		/**
		 * Media present in the ad or post; image or video
		 */
		media_type: string;
		/**
		 * URL of the image, when media_type is an image
		 */
		image_url: string;
		/**
		 * URL of the video, when media_type is a video
		 */
		video_url: string;
		/**
		 * URL for the thumbnail, when media_type is a video
		 */
		thumbnail_url: string;
		ctwa_clid: string;
	};
	/**
	 * When messages type is set to sticker.
	 */
	sticker?: {
		mime_type: LiteralUnion<"image/webp">;
		sha256: string;
		/**
		 *  ID for the sticker
		 */
		id: string;
		/**
		 *  Set to true if the sticker is animated; false otherwise.
		 */
		animated: boolean;
	};
	/**
	 * When messages type is set to system, a customer has updated their phone number or profile information
	 */
	system?: {
		/**
		 * Describes the change to the customer's identity or phone number
		 */
		body: string;
		/**
		 * Hash for the identity fetched from server
		 */
		identity: string;
		/**
		 * New WhatsApp ID for the customer when their phone number is updated. Available on webhook versions V11 and below
		 */
		new_wa_id: string;
		/**
		 * New WhatsApp ID for the customer when their phone number is updated. Available on webhook versions V12 and above
		 */
		wa_id: string;
		/**
		 * Type of system update.
		 */
		type: {
			/**
			 * A customer changed their phone number
			 */
			customer_changed_number: boolean;
			/**
			 * A customer changed their profile information
			 */
			customer_identity_changed: boolean;
		};
		/**
		 * The WhatsApp ID for the customer prior to the update
		 */
		customer: string;
	};
	/**
	 * When messages type is set to text.
	 */
	text?: {
		body: string;
	};
	/**
	 * When messages type is set to video.
	 */
	video?: WebhookMedia;
	/**
	 * When messages type is set to reaction.
	 */
	reaction?: ReactionMessage;
};

/**
 * For more information about this object, go here https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components#statuses-object
 */
export type WebhookStatus = {
	/**
	 * The ID for the message that the business that is subscribed to the webhooks sent to a customer
	 */
	id: string;
	/**
	 * Arbitrary string included in sent message. See Message object.
	 */
	biz_opaque_callback_data: string;
	/**
	 * An object containing billing information.
	 */
	pricing: {
		/**
		 * Indicates the conversation pricing category
		 */
		category: "authentication" | "marketing" | "utility" | "service" | "referral_conversion";
		/**
		 *  Type of pricing model used by the business.
		 */
		pricing_model: LiteralUnion<"CBP">;
	};
	conversation: {
		/**
		 *  Represents the ID of the conversation the given status notification belongs to.
		 */
		id: string;
		/**
		 *  Indicates who initiated the conversation
		 */
		origin: {
			/**
			 * Indicates where a conversation has started. This can also be referred to as a conversation entry point
			 */
			type:
				| "authentication"
				| "marketing"
				| "utility"
				| "service"
				| "business_initiated"
				| "customer_initiated"
				| "referral_conversation";
			/**
			 *  Date when the conversation expires. This field is only present for messages with a `status` set to `sent`
			 */
		};
		expiration_timestamp: string;
	};
	/**
	 * The WhatsApp ID for the customer that the business, that is subscribed to the webhooks, sent to the customer
	 */
	recipient_id: string;
	status: "delivered" | "failed" | "read" | "sent";
	/**
	 * Date for the status message in unix
	 */
	timestamp: number;
};

export type WebhookMetadata = {
	display_phone_number: string;
	phone_number_id: string;
};

export type WebhookChange = {
	value: {
		messaging_product: "whatsapp";
		metadata: WebhookMetadata;
		errors: WebhookError[];
		contacts: WebhookContact[];
		messages?: WebhookMessage[];
		statuses?: WebhookStatus[];
	};
	field: LiteralUnion<"messages">;
};

/**
 * Webhooks are triggered when a customer performs an action or the status for a message a business sends a customer changes.
 * To add webhooks go here https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks
 * To see examples of Webhooks Responses go here: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples
 */
export type Webhook = {
	object: string;
	entry: [
		{
			id: string;
			changes: WebhookChange[];
		},
	];
};

export type WebhookEvents = {
	/**
	 * Gets fired when the server starts listening
	 */
	onStartListening?: () => void;
	/**
	 * This event gets fired on any webhooks messages, you'll have to differentiate between the message type
	 */
	onMessageReceived?: (
		payload: WebhookMessage,
		contact: WebhookContact,
		metadata?: WebhookMetadata
	) => void;
	/**
	 * Gets fired when the received message is type of text
	 */
	onTextMessageReceived?: (
		textMessage: Pick<WebhookMessage, "type" | "timestamp" | "text" | "from" | "id">,
		contact: WebhookContact,
		metadata?: WebhookMetadata
	) => void;
	/**
	 * Gets triggered when a message is sent or delivered to a customer
	 * or the customer reads the delivered message sent by a business that is subscribed to the Webhooks.
	 */
	onStatusReceived?: (payload: WebhookStatus, metadata?: WebhookMetadata) => void;
	/**
	 * Gets fired whenever there is an err
	 */
	onError?: (payload: WebhookError) => void;
};
