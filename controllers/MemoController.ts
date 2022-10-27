import { Server as SocketIO } from 'socket.io';
import { Request, Response } from 'express';
import { logger } from '../utilities/logger';
import { MemoService } from '../services/MemoService';
import { parse, form } from '../utilities/utils';
import formidable from 'formidable';

export class MemoController {
	constructor(private memoService: MemoService, private io: SocketIO) {}

	getMemos = async (req: Request, res: Response) => {
		try {
			logger.debug('Before reading memos.json');
			const result = await this.memoService.getMemos();
			res.json(result);
		} catch (e) {
			logger.error(e);
			res.status(500).json({ msg: '[MEM001]: Failed to get Memos' });
		}
	};

	postMemos = async (req: Request, res: Response) => {
		try {
			logger.debug('Before reading memos.json');
			const [fields, files] = await parse(form, req);
			const result = await this.memoService.postMemos(
				fields.content as string,
				(files.image as formidable.File)?.newFilename
			);

			this.io.emit('new-memo', result);

			res.json(result);
		} catch (e) {
			logger.error(e);
			res.status(500).json({ msg: '[MEM001]: Failed to get Memos' });
		}
	};

	updateMemos = async (req: Request, res: Response) => {
		try {
			logger.debug('Before reading memos.json');
			const updateIndex = parseInt(req.params.index);
			const result = await this.memoService.updateMemos(
				req.body.content,
				updateIndex
			);

			this.io.emit('new-memo', result);
			res.json(result);
		} catch (e) {
			logger.error(e);
			res.status(500).json({ msg: '[MEM001]: Failed to get Memos' });
		}
	};

	deleteMemos = async (req: Request, res: Response) => {
		try {
			logger.debug('Before reading memos.json');
			const deleteIndex = parseInt(req.params.index);
			const result = await this.memoService.deleteMemos(deleteIndex);
			this.io.emit('new-memo', result);
			res.json(result);
		} catch (e) {
			logger.error(e);
			res.status(500).json({ msg: '[MEM001]: Failed to get Memos' });
		}
	};
}
