export type MediaAcceptedFileTypes =
	| "image/jpeg"
	| "image/png"
	| "text/plain"
	| "application/pdf"
	| "application/vnd.ms-powerpoint"
	| "application/msword"
	| "application/vnd.ms-excel"
	| "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	| "application/vnd.openxmlformats-officedocument.presentationml.presentation"
	| "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	| "audio/aac"
	| "audio/mp4"
	| "audio/mpeg"
	| "audio/amr"
	| "audio/ogg"
	| "audio/opus"
	| "video/mp4"
	| "video/3gp"
	| "image/webp";

export type UploadMediaPayload = {
	/**
	 * Path to the file stored in your local directory. For example: "@/local/path/file.jpg".
	 */
	file: string;
	type: MediaAcceptedFileTypes;
	messaging_product: "whatsapp";
};

export type UploadMediaResponse = {
	id: string;
};

export type GetMediaResponse = {
	messaging_product: "whatsapp";
	url: string;
	mime_type: MediaAcceptedFileTypes;
	sha256: string;
	file_size: string;
	id: string;
};
