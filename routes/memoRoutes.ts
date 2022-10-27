import express from 'express';
import { isLoggedInAPI } from '../utilities/guard';
import { memoController } from '../app';

export const memoRoutes = () => {
	const memoRoutes = express.Router();

	memoRoutes.get('/', memoController.getMemos);
	memoRoutes.post('/', memoController.postMemos);
	memoRoutes.put('/:index', isLoggedInAPI, memoController.updateMemos);
	memoRoutes.delete('/:index', isLoggedInAPI, memoController.deleteMemos);

	return memoRoutes;
};
