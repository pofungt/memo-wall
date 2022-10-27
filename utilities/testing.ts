import { Server as SocketIO } from 'socket.io';
import { Request, Response } from 'express';

export function createSocketIO() {
	return {
		emit: jest.fn((event: string, data: any) => null)
	} as unknown as SocketIO;
}

export function createRequest() {
	return {} as unknown as Request;
}

export function createResponse() {
	let res: any = {};
	res.status = jest.fn((status: number) => res);
	res.json = jest.fn(() => null);
	return res as unknown as Response;
}
