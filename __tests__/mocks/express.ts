import { Request, Response } from "express";

jest.mock("express", () => ({
	__esModule: true,
	default: jest.fn(() => ({
		listen: jest.fn((port: number, callback?: () => void) => callback && callback()),
		use: jest.fn((first: any, second?: any) => ({})),
	})),
	Router: jest.fn(() => ({
		get: jest.fn((first: string, callback: () => void) => ({})),
		post: jest.fn(),
	})),
	json: jest.fn(),
	urlencoded: jest.fn(),
}));

const response = () => {
	const res: Partial<Response> = {};
	res.status = jest.fn().mockReturnValue(res);
	res.send = jest.fn().mockReturnValue(res);
	return res;
};

export const request = () => {
	const req: Partial<Request> = { body: {}, query: {} };
	return req;
};

export const mockResponse = response as () => Response;
export const mockRequest = request as () => Request;
