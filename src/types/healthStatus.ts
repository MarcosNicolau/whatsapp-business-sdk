export type CanSendMessage = "AVAILABLE" | "LIMITED" | "BLOCKED";

export type HealthStatusEntity = {
	id: string;
	entity_type: "PHONE_NUMBER" | "MESSAGE_TEMPLATE" | "WABA" | "BUSINESS" | "APP";
	can_send_message: CanSendMessage;
	/**
	 * If a given node's can_send_message property is set to LIMITED, the additional_info property will be included, which provides additional context for the limitation.
	 */
	additional_info?: string[];
	/**
	 * If a given node's can_send_message property is set to BLOCKED, the errors property will be included, which describes the reason for the status and a possible solution.
	 */
	errors?: {
		error_code: number;
		error_description: string;
		possible_solution: string;
	}[];
};

/**
 * See more https://developers.facebook.com/docs/whatsapp/cloud-api/health-status
 */
export type HealthStatusResponse = {
	health_status: {
		/**
		 *
		 * Represents the overall health status property.
		 *
		 * It will be set as follows:
		 * - If one or more nodes is blocked, it will be set to BLOCKED.
		 * - If no nodes are blocked, but one or more nodes is limited, it will be set to LIMITED.
		 * - If all nodes are available, it will be set to AVAILABLE.
		 */
		can_send_message: CanSendMessage;
		entities: HealthStatusEntity[];
	};
	id: string;
};
