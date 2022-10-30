import { Knex } from 'knex';

export class MemoService {
	constructor(private knex: Knex) {}

	async getMemos() {
		return await this.knex.select('*').from('memos').orderBy('created_at');
	}

	async postMemos(content: string, newFilename: string) {
		try {
			await this.knex
				.insert({
					content: content,
					image: newFilename
				})
				.into('memos');
			return await this.knex.select('*').from('memos').orderBy('created_at');
		} catch(e) {
			console.log(e);
			return;
		}
	}

	async updateMemos(content: string, updateIndex: number) {
		try {
			await this.knex('memos')
				.update({
					content: content
				})
				.where('id', updateIndex);
	
			return await this.knex.select('*').from('memos').orderBy('created_at');
		} catch(e) {
			console.log(e);
			return;
		}
	}

	async deleteMemos(deleteIndex: number) {
		try {
			await this.knex('likes').where('memo_id', deleteIndex).del();
			await this.knex('memos').where('id', deleteIndex).del();
	
			return await this.knex.select('*').from('memos').orderBy('created_at');
		} catch(e) {
			console.log(e);
			return;
		}
	}
}
