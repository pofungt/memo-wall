import { Knex } from 'knex';
import { hashPassword } from '../hash';

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex('likes').del();
	await knex('memos').del();
	await knex('users').del();

	// Inserts seed entries
	await knex('users').insert([
		{ id: 1, username: 'Duncan', password: await hashPassword('test') },
		{ id: 2, username: 'Gordon', password: await hashPassword('test') }
	]);
	await knex('memos').insert([
		{ id: 1, content: 'Hello' },
		{ id: 2, content: 'Hong Kong' }
	]);
	await knex('likes').insert([
		{ user_id: 1, memo_id: 1 },
		{ user_id: 1, memo_id: 2 },
		{ user_id: 2, memo_id: 1 }
	]);
}
