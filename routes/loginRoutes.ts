import express from 'express';
import { loginController } from '../app';

export const loginRoutes = () => {
	const loginRoutes = express.Router();

	loginRoutes.get('/', loginController.getLoginStatus);
	loginRoutes.post('/', loginController.checkLogin);
	loginRoutes.get('/google', loginController.loginGoogle);

	return loginRoutes;
};
