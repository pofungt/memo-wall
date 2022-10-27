import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('likes', (table) => {
		table.increments();
		table.integer('user_id').unsigned();
		table.foreign('user_id').references('users.id');
		table.integer('memo_id').unsigned();
		table.foreign('memo_id').references('memos.id');
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('likes');
}
