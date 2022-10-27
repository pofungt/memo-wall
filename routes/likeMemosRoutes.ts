import express from 'express';
import { likeMemosController } from '../app';
import { isLoggedInAPI } from '../utilities/guard';

export const likeMemosRoutes = () => {
	const likeMemosRoutes = express.Router();

	likeMemosRoutes.get('/', likeMemosController.getLikeMemos);
	likeMemosRoutes.put(
		'/:id',
		isLoggedInAPI,
		likeMemosController.updateLikeMemos
	);
	likeMemosRoutes.delete(
		'/:id',
		isLoggedInAPI,
		likeMemosController.deleteLikeMemos
	);

	return likeMemosRoutes;
};
