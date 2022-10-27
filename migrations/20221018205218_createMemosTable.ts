import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('memos', (table) => {
		table.increments();
		table.text('content');
		table.string('image');
		table.timestamps(false, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('memos');
}
