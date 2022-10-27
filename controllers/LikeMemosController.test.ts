import { Request, Response } from 'express';
import { createRequest, createResponse } from '../utilities/testing';
import { LikeMemosService } from '../services/LikeMemosService';
import { LikeMemosController } from './LikeMemosController';
import { Knex } from 'knex';

describe('Like Memos Controller', () => {
	let req: Request;
	let res: Response;
	let likeMemosService: LikeMemosService;
	let likeMemosController: LikeMemosController;

	beforeEach(() => {
		likeMemosService = new LikeMemosService({} as Knex);
		likeMemosController = new LikeMemosController(likeMemosService);
		req = createRequest();
		res = createResponse();
		likeMemosService.getLikeMemos = jest.fn(async (username: string) => [
			{
				username: 'Duncan',
				password: 'test',
				id: 1
			}
		]);
		likeMemosService.updateLikeMemos = jest.fn(
			async (user_id: number, memo_id: number) => ({ status: 'success' })
		);
		likeMemosService.deleteLikeMemos = jest.fn(
			async (user_id: number, memo_id: number) => ({ status: 'success' })
		);
	});

	it('should get like memos', async () => {
		req = {
			query: { user: 'Duncan' }
		} as unknown as Request;

		await likeMemosController.getLikeMemos(req, res);

		expect(likeMemosService.getLikeMemos).toBeCalledTimes(1);
		expect(likeMemosService.getLikeMemos).toBeCalledWith('Duncan');
		expect(res.json).toBeCalledTimes(1);
		expect(res.json).toBeCalledWith([
			{
				username: 'Duncan',
				password: 'test',
				id: 1
			}
		]);
	});

	it('should update like memos', async () => {
		req = {
			session: { user: 1 },
			params: { id: '1' }
		} as unknown as Request;

		await likeMemosController.updateLikeMemos(req, res);

		expect(likeMemosService.updateLikeMemos).toBeCalledTimes(1);
		expect(likeMemosService.updateLikeMemos).toBeCalledWith(1, 1);
		expect(res.json).toBeCalledTimes(1);
		expect(res.json).toBeCalledWith({ status: 'success' });
	});

	it('should delete like memos', async () => {
		req = {
			session: { user: 1 },
			params: { id: '1' }
		} as unknown as Request;

		await likeMemosController.deleteLikeMemos(req, res);

		expect(likeMemosService.deleteLikeMemos).toBeCalledTimes(1);
		expect(likeMemosService.deleteLikeMemos).toBeCalledWith(1, 1);
		expect(res.json).toBeCalledTimes(1);
		expect(res.json).toBeCalledWith({ status: 'success' });
	});

	it('should fail to delete like memos', async () => {
		req = {
			params: { id: null }
		} as unknown as Request;

		await likeMemosController.deleteLikeMemos(req, res);

		expect(likeMemosService.deleteLikeMemos).not.toHaveBeenCalled();
		expect(res.status).toBeCalledTimes(1);
		expect(res.status).toBeCalledWith(500);
		expect(res.json).toBeCalledTimes(1);
		expect(res.json).toBeCalledWith({
			msg: '[MEM004]: Failed to delete Like Memos'
		});
	});
});
