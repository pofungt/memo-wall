import { LikeMemosService } from '../services/LikeMemosService';
import { logger } from '../utilities/logger';
import { Request, Response } from 'express';

export class LikeMemosController {
	constructor(private likeMemosService: LikeMemosService) {}

	getLikeMemos = async (req: Request, res: Response) => {
		try {
			logger.debug('Before reading memos.json');
			const result = await this.likeMemosService.getLikeMemos(
				req.query.user as string
			);
			res.json(result);
		} catch (e) {
			// logger.error(e);
			res.status(500).json({ msg: '[MEM002]: Failed to get Like Memos' });
		}
	};

	updateLikeMemos = async (req: Request, res: Response) => {
		try {
			logger.debug('Before reading memos.json');
			const user_id = req.session.user as number;
			const memo_id = parseInt(req.params.id) as number;
			const result = await this.likeMemosService.updateLikeMemos(
				user_id,
				memo_id
			);
			res.json(result);
		} catch (e) {
			logger.error(e);
			res.status(500).json({
				msg: '[MEM003]: Failed to update Like Memos'
			});
		}
	};

	deleteLikeMemos = async (req: Request, res: Response) => {
		try {
			logger.debug('Before reading memos.json');
			const user_id = req.session.user as number;
			const memo_id = parseInt(req.params.id);
			const result = await this.likeMemosService.deleteLikeMemos(
				user_id,
				memo_id
			);
			res.json(result);
		} catch (e) {
			// logger.error(e);
			res.status(500).json({
				msg: '[MEM004]: Failed to delete Like Memos'
			});
		}
	};
}
