import { LoginService } from '../services/LoginService';
import { logger } from '../utilities/logger';
import { Request, Response } from 'express';
import { checkPassword } from '../hash';
import fetch from 'cross-fetch';
import { User } from '../utilities/models';

export class LoginController {
	constructor(private loginService: LoginService) {}

	getLoginStatus = async (req: Request, res: Response) => {
		try {
			logger.debug('Before reading memos.json');
			const user_id = req.session.user;
			if (user_id) {
				const loginUser: User = await this.loginService.getLoginStatus(
					user_id
				);
				if (loginUser) {
					res.json({
						status: true,
						user: loginUser.username
					});
				}
			} else {
				res.status(401).json({ login: false });
			}
		} catch (e) {
			logger.error(e);
			res.status(500).json({
				msg: '[LOG001]: Failed to check Login Status'
			});
		}
	};

	checkLogin = async (req: Request, res: Response) => {
		try {
			logger.debug('Before reading memos.json');
			const username = req.body.username as string;
			const loginUser: User = await this.loginService.checkLogin(
				username
			);
			if (loginUser) {
				const match = await checkPassword(
					req.body.password,
					loginUser.password
				);
				if (match) {
					req.session.user = loginUser.id;
					res.json({
						status: true,
						user: loginUser.username
					});
				} else {
					res.status(401).json({ status: false });
				}
			} else {
				res.status(401).json({ status: false });
			}
		} catch (e) {
			logger.error(e);
			res.status(500).json({ msg: '[LOG002]: Failed to check Login' });
		}
	};

	loginGoogle = async (req: Request, res: Response) => {
		const accessToken = req.session?.['grant'].response.access_token;
		const fetchRes = await fetch(
			'https://www.googleapis.com/oauth2/v2/userinfo',
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		);
		const fetchedUser = await fetchRes.json();
		const user = await this.loginService.loginGoogle(fetchedUser.email);
		req.session.user = user.username;
		res.redirect('/index.html');
	};
}
