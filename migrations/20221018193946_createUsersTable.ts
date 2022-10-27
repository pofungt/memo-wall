import { Knex } from 'knex';

export async function up(knex: Knex) {
	await knex.schema.createTable('users', (table) => {
		table.increments();
		table.text('username');
		table.string('password');
		table.timestamps(false, true);
	});
}

export async function down(knex: Knex) {
	await knex.schema.dropTable('users');
}
