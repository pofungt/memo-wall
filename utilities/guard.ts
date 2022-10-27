import express from 'express';
import path from 'path';

export const isLoggedIn = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session?.user) {
		//called Next here
		next();
	} else {
		res.sendFile(path.resolve('./public/404.html'));
	}
};

export const isLoggedInAPI = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session?.user) {
		//called Next here
		next();
	} else {
		res.status(400).json({ error_msg: 'No permission!' });
	}
};
