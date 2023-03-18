import { GenerateMappedNever, LiteralUnion } from "./utils";

export type SendMessageResponse = {
	messaging_product: "whatsapp";
	contacts: [
		{
			input: string;
			wa_id: string;
		}
	];
	messages: [
		{
			/**
			 * Use the id to track your message status.
			 */
			id: string;
		}
	];
};

export type MarkMessageAsReadPayload = {
	messaging_product: "whatsapp";
	status: "read";
	message_id: string;
};

export type MessageType =
	| "audio"
	| "contacts"
	| "document"
	| "image"
	| "interactive"
	| "location"
	| "sticker"
	| "template"
	| "text"
	| "video"
	| "reaction";

export type MessageContext = {
	/**
	 * The message id you receive on the webhooks
	 */
	message_id: string;
};

export type Message = {
	/**
	 * Defaults to text
	 */
	type?: MessageType;
	messaging_product: LiteralUnion<"whatsapp">;
	recipient_type?: LiteralUnion<"individual">;
	/**
	 * Use it if you want to use the reply-to feature when answering a message
	 */
	context?: MessageContext;
	/**
	 * WhatsApp ID or phone number for the person you want to send a message to.
	 * See https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#formatting for more information.
	 */
	to: string;
	/**
	 * Required when type=audio.
	 */
	audio?: MediaObject;
	/**
	 * Required when type=contacts
	 */
	contacts?: ContactMessage;
	/**
	 * Required when type=document
	 */
	document?: MediaObject;
	/**
	 * Required when type=image.
	 */
	image?: MediaObject;
	/**
	 * Required when type=interactive.
	 */
	interactive?: InteractiveMessage;
	/**
	 * Required when type=location.
	 */
	location?: LocationMessage;
	/**
	 * Required when type=sticker.
	 */
	sticker?: MediaObject;
	/**
	 * Required when type=template.
	 */
	template?: TemplateMessage;
	/**
	 * Required when type=text.
	 */
	text?: TextMessage;
	/**
	 * Required when type=video.
	 */
	video?: MediaObject;
	/**
	 * Required when type=reaction.
	 */
	reaction?: ReactionMessage;
};

export type MediaObject = {
	/**
	 * Required when type is audio, document, or image and you are not using a link.
	 *
	 * You get the media object ID after uploading a media to whatsapp server. For further information refer here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#get-media-id
	 */
	id?: string;
	/**
	 * Required when type is audio, document, image, sticker, or video and you are not using an uploaded media ID (i.e. you are hosting the media asset on your server).
	 *
	 * The protocol and URL of the media to be sent. Use only with HTTP/HTTPS URLs.
	 */
	link?: string;
	/**
	 * Describes the specified image, document, or video media.
	 *
	 * Do not use with audio or sticker media.
	 */
	caption?: string;
	/**
	 * Describes the filename for the specific document. Use only with document media.
	 *
	 * The extension of the filename will specify what format the document is displayed as in WhatsApp.
	 */
	filename?: string;
	/**
	 * This path is optionally used with a link when the HTTP/HTTPS link is not directly accessible and requires additional configurations like a bearer token.
	 */
	provider?: string;
};

export type ContactMessageAddress = {
	street?: string;
	city?: string;
	state?: string;
	zip?: string;
	country?: string;
	country_code?: string;
	type?: LiteralUnion<"HOME" | "WORK">;
};

export type ContactMessageEmail = {
	email?: string;
	type?: LiteralUnion<"HOME" | "WORK">;
};

export type ContactMessageName = {
	formatted_name: string;
	first_name?: string;
	last_name?: string;
	middle_name?: string;
	suffix?: string;
	prefix?: string;
};

export type ContactMessageOrg = {
	company?: string;
	department?: string;
	title?: string;
};

export type ContactMessagePhone = {
	/**
	 * Automatically populated with the wa_id value as a formatted phone number.
	 */
	phone?: string;
	type?: LiteralUnion<"CELL" | "MAIN" | "IPHONE" | "HOME" | "WORK">;
	wa_id?: string;
};

export type ContactMessageUrl = {
	url?: string;
	type?: LiteralUnion<"HOME" | "WORK">;
};

export type InteractiveActionSection = {
	/**
	 * Required for Multi-Product Messages.
	 * Array of product objects. There is a minimum of 1 product per section and a maximum of 30 products across all sections.
	 */
	product_items: {
		/**
		 * Unique identifier of the product in a catalog.
		 */
		product_retailer_id: string;
	};
	/**
	 * Required for List Messages.
	 * Contains a list of rows. You can have a total of 10 rows across your sections.
	 */
	rows: {
		/**
		 * Maximum length: 200 characters
		 */
		id: string;
		/**
		 * Maximum length: 24 characters
		 */
		title: string;
		/**
		 * Maximum length: 72 characters
		 */
		description?: string;
	}[];
	/**
	 * Required if the message has more than one section.
	 * Title of the section.
	 *
	 * Maximum length: 24 characters.
	 */
	title: string;
};

export type InteractiveMessageAction = {
	/**
	 * Required for List Messages.
	 * Button content. It cannot be an empty string and must be unique within the message. Emojis are supported, markdown is not.
	 *
	 * Maximum length: 20 characters.
	 */
	button?: string;
	/**
	 * Required for Reply Buttons.
	 * You can have up to 3 buttons. You cannot have leading or trailing spaces when setting the ID.
	 */
	buttons?: {
		type: "reply";
		reply: {
			/**
			 * Button title. It cannot be an empty string and must be unique within the message. Emojis are supported, markdown is not. Maximum length: 20 characters.
			 */
			title: string;
			/**
			 * Unique identifier for your button. This ID is returned in the webhook when the button is clicked by the user. Maximum length: 256 characters.
			 */
			id: string;
		};
	}[];
	/**
	 * Required for Single Product Messages and Multi-Product Messages.
	 * Unique identifier of the Facebook catalog linked to your WhatsApp Business Account. This ID can be retrieved via the Meta Commerce Manager.
	 */
	catalog_id?: string;
	/**
	 * Required for Single Product Messages and Multi-Product Messages.
	 * Unique identifier of the product in a catalog.
	 *
	 * To get this ID go to Meta Commerce Manager and select your Meta Business account.
	 */
	product_retailer_id?: string;
	/**
	 * Required for List Messages and Multi-Product Messages.
	 * Array of section objects. Minimum of 1, maximum of 10/
	 */
	sections?: InteractiveActionSection[];
};

export type InteractiveMessageBody = {
	/**
	 * Required if body is present. The content of the message. Emojis and markdown are supported. Maximum length: 1024 characters.
	 */
	text: string;
};

export type InteractiveMessageFooter = {
	/**
	 * Required if footer is present. The footer content. Emojis, markdown, and links are supported. Maximum length: 60 characters.
	 */
	text: string;
};

export type InteractiveMessageHeader = {
	/**
	 * The header type you would like to use. Supported values:
	 * 
	 * text: Used for List Messages, Reply Buttons, and Multi-Product Messages.
	 * video: Used for Reply Buttons.
	 * image: Used for Reply Buttons.
	 * document: Used for Reply Buttons.

	 */
	type: "text" | "video" | "message" | "document";
	/**
	 * Required if type is set to text.
	 * Text for the header. Formatting allows emojis, but not markdown.
	 *
	 * Maximum length: 60 characters.
	 */
	text?: string;
	/**
	 * Required if type is set to video. Contains the media object for this video.
	 */
	video?: MediaObject;
	/**
	 * Required if type is set to image.
	 * Contains the media object for this image.
	 */
	image?: MediaObject;
	/**
	 * Required if type is set to document.
	 * Contains the media object for this document.
	 */
	document?: MediaObject;
};

export type InteractiveMessage = {
	/**
	 * Action you want the user to perform after reading the message.
	 */
	action: InteractiveMessageAction;
	/**
	 * The body of the message. Optional for type product. Required for other message types.
	 */
	body?: InteractiveMessageBody;
	/**
	 * The footer of the message. Emojis and markdown are supported.
	 * Maximum length: 60 characters.
	 */
	footer?: InteractiveMessageFooter;
	/**
	 * Required for type product_list. Optional for other types.
	 * Header content displayed on top of a message. You cannot set a header if your interactive object is of product type.
	 */
	header?: InteractiveMessageHeader;
	type: "list" | "button" | "product" | "product_list";
};

export type ContactMessage = {
	addresses?: ContactMessageAddress[];
	/**
	 * birthday formatted in YYYY-MM-DD
	 */
	birthday?: string;
	emails: ContactMessageEmail[];
	name: ContactMessageName;
	org: ContactMessageOrg;
	phones: ContactMessagePhone[];
	urls: ContactMessageUrl[];
};

export type LocationMessage = {
	longitude: string;
	latitude: string;
	name?: string;
	/**
	 * Address of the location. Only displayed if name is present.a
	 */
	address?: string;
};

export type TemplateMessageParameter = {
	type: "text" | "currency" | "date_time" | "image" | "document" | "video";
	/**
	 * required for type=text
	 */
	text?: string;
	/**
	 * required for type=currency
	 */
	currency?: {
		fallback_value: string;
		/**
		 * Currency code as defined in ISO 4217.
		 */
		code: string;
		/**
		 * Amount multiplied by 1000.
		 */
		amount_1000: string;
	};
	date_time?: {
		fallback_value: string;
	};
	image?: MediaObject;
	document?: MediaObject;
	video?: MediaObject;
};

//Adding never types to still have autocompletion when doing a union
export type TemplateMessageButtonParameter = GenerateMappedNever<TemplateMessageParameter> & {
	type: "payload" | "text";
	/**
	 * required for quick_reply buttons
	 * Developer-defined payload that is returned when the button is clicked in addition to the display text on the button.
	 */
	payload?: any;
	/**
	 * required for url buttons
	 */
	text?: string;
};

export type TemplateMessageComponent = {
	type: "header" | "body" | "button";
	/**
	 * required when type=button
	 */
	sub_type?: "quick_reply" | "url";
	/**
	 * required when type=button
	 */
	parameters?: TemplateMessageButtonParameter[] | TemplateMessageParameter[];
	/**
	 * required when type=button
	 */
	index?: number;
};

export type TemplateMessageLanguage = {
	/**
	 * The language policy the message should follow. See Language Policy Options for more information.
	 */
	policy: LiteralUnion<"deterministic">;
	/**
	 * The code of the language or locale to use. Accepts both language and language_locale formats (e.g., en and en_US).
	 */
	code: string;
};

export type TemplateMessage = {
	name: string;
	language: string;
	components: TemplateMessageComponent[];
};

export type TextMessage = {
	/**
	 *
	 * The text of the text message which can contain URLs which begin with
	 * http:// or https:// and formatting. See available formatting options here
	 * https://developers.facebook.com/docs/whatsapp/on-premises/reference/messages#formatting.
	 *
	 * If you include URLs in your text and want to include a preview box in text messages (preview_url: true), make sure the URL starts with http:// or https:// —https:// URLs are preferred. You must include a hostname, since IP addresses will not be matched.
	 *
	 * Maximum length: 4096 characters
	 */
	body: string;
	/**
	 * By default, WhatsApp recognizes URLs and makes them clickable,
	 * but you can also include a preview box with more information about the link. Set this field to true if you want to include a URL preview box.
	 *
	 * The majority of the time, the receiver will see a URL they can click on when you send an URL, set preview_url to true, and provide a body object with a http or https link.
	 *
	 * Default: false.
	 */
	preview_url?: boolean;
};

export type ReactionMessage = {
	/**
	 * The WhatsApp Message ID (wamid) of the message on which the reaction should appear. The reaction will not be sent if:
	 *
	 *  - The message is older than 30 days
	 *  - The message is a reaction message
	 *  - The message has been deleted
	 *
	 * If the ID is of a message that has been deleted, the message will not be deliver
	 */
	message_id: string;
	/**
	 * Emoji to appear on the message.
	 *
	 * - All emojis supported by Android and iOS devices are supported.
	 * - Rendered-emojis are supported.
	 * - If using emoji unicode values, values must be Java- or JavaScript-escape encoded. to see emoji
	 * - Only one emoji can be sent in a reaction message
	 * - Use an empty string to remove a previously sent emoji.
	 */
	emoji: string;
};
