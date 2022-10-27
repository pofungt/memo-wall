import crypto from 'crypto';
import { hashPassword } from '../hash';
import { Knex } from 'knex';
import { User } from '../utilities/models';

export class LoginService {
	constructor(private knex: Knex) { }

	async getLoginStatus(user_id: number) {
		const [loginUser]: User[] = await this.knex
			.select('*')
			.from('users')
			.where('id', user_id);
		return loginUser;
	}

	async checkLogin(username: string) {
		const [loginUser]: User[] = await this.knex
			.select('*')
			.from('users')
			.where('username', username);
		return loginUser;
	}

	async loginGoogle(username: string) {
		let [user] = await this.knex
			.select('*')
			.from('users')
			.where('username', username);
		if (!user) {
			user = {
				username: username,
				password: crypto.randomBytes(20).toString('hex')
			};
			await this.knex('users').insert({
				username: user.username,
				password: await hashPassword(user.password)
			});
		}
		return user;
	}
}
