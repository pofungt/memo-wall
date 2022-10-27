import { Server as SocketIO } from 'socket.io';
import { Request, Response } from 'express';
import { Knex } from 'knex';
import { MemoService } from '../services/MemoService';
import { MemoController } from './MemoController';
import {
	createRequest,
	createResponse,
	createSocketIO
} from '../utilities/testing';
import { parse } from '../utilities/utils';

jest.mock('../utilities/utils');

describe('Memo Controller', () => {
	let memoService: MemoService;
	let memoController: MemoController;
	let io: SocketIO;
	let req: Request;
	let res: Response;
	beforeEach(() => {
		memoService = new MemoService({} as Knex);
		memoService.getMemos = jest.fn(async () => [
			{
				content: 'Hello',
				image: 'Hello.jpg',
				liked_by: []
			}
		]);
		memoService.postMemos = jest.fn(
			async (content: string, newFilename: string) => [
				{
					content: 'Hello',
					image: 'Hello.jpg',
					liked_by: []
				}
			]
		);
		memoService.updateMemos = jest.fn(
			async (content: string, updateIndex: number) => [
				{
					content: 'Hello',
					image: 'Hello.jpg',
					liked_by: []
				}
			]
		);
		memoService.deleteMemos = jest.fn(async (deleteIndex: number) => [
			{
				content: 'Hello',
				image: 'Hello.jpg',
				liked_by: []
			}
		]);
		io = createSocketIO();
		req = createRequest();
		res = createResponse();
		memoController = new MemoController(memoService, io);
		(parse as jest.Mock).mockReturnValue([
			{ content: '123456' },
			{ image: { newFilename: 'new-filename.png' } }
		]);
	});

	it('should get memos', async () => {
		await memoController.getMemos(req, res);

		expect(memoService.getMemos).toBeCalledTimes(1);
		expect(res.json).toBeCalledTimes(1);
		expect(res.json).toBeCalledWith([
			{
				content: 'Hello',
				image: 'Hello.jpg',
				liked_by: []
			}
		]);
	});

	it('should post memos', async () => {
		await memoController.postMemos(req, res);

		expect(memoService.postMemos).toBeCalledWith(
			'123456',
			'new-filename.png'
		);
		expect(memoService.postMemos).toBeCalledTimes(1);
		expect(io.emit).toBeCalledWith('new-memo', [
			{
				content: 'Hello',
				image: 'Hello.jpg',
				liked_by: []
			}
		]);
		expect(res.json).toBeCalledTimes(1);
		expect(res.json).toBeCalledWith([
			{
				content: 'Hello',
				image: 'Hello.jpg',
				liked_by: []
			}
		]);
	});

	it('should update memos', async () => {
		req = {
			params: { index: '1' },
			body: { content: 'Hello' }
		} as unknown as Request;

		await memoController.updateMemos(req, res);

		expect(memoService.updateMemos).toBeCalledWith('Hello', 1);
		expect(memoService.updateMemos).toBeCalledTimes(1);
		expect(io.emit).toBeCalledWith('new-memo', [
			{
				content: 'Hello',
				image: 'Hello.jpg',
				liked_by: []
			}
		]);
		expect(res.json).toBeCalledTimes(1);
		expect(res.json).toBeCalledWith([
			{
				content: 'Hello',
				image: 'Hello.jpg',
				liked_by: []
			}
		]);
	});

	it('should delete memos', async () => {
		req = {
			params: { index: '1' }
		} as unknown as Request;

		await memoController.deleteMemos(req, res);

		expect(memoService.deleteMemos).toBeCalledWith(1);
		expect(memoService.deleteMemos).toBeCalledTimes(1);
		expect(io.emit).toBeCalledWith('new-memo', [
			{
				content: 'Hello',
				image: 'Hello.jpg',
				liked_by: []
			}
		]);
		expect(res.json).toBeCalledTimes(1);
		expect(res.json).toBeCalledWith([
			{
				content: 'Hello',
				image: 'Hello.jpg',
				liked_by: []
			}
		]);
	});
});
