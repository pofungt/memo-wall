import { Knex } from 'knex';

export class MemoService {
	constructor(private knex: Knex) {}

	async getMemos() {
		return await this.knex.select('*').from('memos').orderBy('created_at');
	}

	async postMemos(content: string, newFilename: string) {
		await this.knex
			.insert({
				content: content,
				image: newFilename
			})
			.into('memos');
		return await this.knex.select('*').from('memos').orderBy('created_at');
	}

	async updateMemos(content: string, updateIndex: number) {
		await this.knex('memos')
			.update({
				content: content
			})
			.where('id', updateIndex);

		return await this.knex.select('*').from('memos').orderBy('created_at');
	}

	async deleteMemos(deleteIndex: number) {
		await this.knex('likes').where('memo_id', deleteIndex).del();
		await this.knex('memos').where('id', deleteIndex).del();

		return await this.knex.select('*').from('memos').orderBy('created_at');
	}
}
