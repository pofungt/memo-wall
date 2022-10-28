import http from 'http';
import { Server as SocketIO } from 'socket.io';
import express from 'express';
import expressSession from 'express-session';
import path from 'path';
import dontenv from 'dotenv';
import grant from 'grant';
import { memoRoutes } from './routes/memoRoutes';
import { isLoggedIn } from './utilities/guard';
import { loginRoutes } from './routes/loginRoutes';
import { likeMemosRoutes } from './routes/likeMemosRoutes';
import { MemoService } from './services/MemoService';
import { MemoController } from './controllers/MemoController';
import { LikeMemosService } from './services/LikeMemosService';
import { LikeMemosController } from './controllers/LikeMemosController';
import { LoginController } from './controllers/LoginController';
import { LoginService } from './services/LoginService';

import Knex from 'knex';
const knexConfig = require('./knexfile');
const knexMode = process.env.NODE_ENV || 'development';
export const knex = Knex(knexConfig[knexMode]);

dontenv.config();

const app = express();
export const server = new http.Server(app);
export const io = new SocketIO(server);

const sessionMiddleware = expressSession({
	secret: 'Tecky Academy teaches typescript',
	resave: true,
	saveUninitialized: true,
	cookie: { secure: false }
});

declare module 'express-session' {
	interface SessionData {
		user?: number;
	}
}

const grantExpress = grant.express({
	defaults: {
		origin: 'https://memowall.duncantang.dev',
		transport: 'session',
		state: true
	},
	google: {
		key: process.env.GOOGLE_CLIENT_ID || '',
		secret: process.env.GOOGLE_CLIENT_SECRET || '',
		scope: [
			'profile',
			'email',
			'https://www.googleapis.com/auth/gmail.send'
		],
		callback: '/login/google'
	}
});

app.use(express.json());

app.use(sessionMiddleware, express.static('public'));

app.use(grantExpress as express.RequestHandler);

export const memoService = new MemoService(knex);
export const memoController = new MemoController(memoService, io);

export const likeMemosService = new LikeMemosService(knex);
export const likeMemosController = new LikeMemosController(likeMemosService);

export const loginService = new LoginService(knex);
export const loginController = new LoginController(loginService);

io.use((socket, next) => {
	let req = socket.request as express.Request;
	let res = req.res as express.Response;
	sessionMiddleware(req, res, next as express.NextFunction);
});

io.on('connection', function (socket) {
	const req = socket.request as express.Request;
	req.session.save();

	if (req.session.user) {
		socket.join(`user-${req.session.user}`);
	}
});

app.use('/memo', memoRoutes());
app.use('/login', loginRoutes());
app.use('/like_memos', likeMemosRoutes());

// admin.html should be inside protected
app.use(isLoggedIn, express.static('protected'));

app.use((req, res) => {
	res.status(404);
	res.sendFile(path.resolve('./public/404.html'));
});

const PORT = 8080;
server.listen(PORT, () => {
	console.log(`Listening at http://memowall.duncantang.dev:${PORT}/`);
});