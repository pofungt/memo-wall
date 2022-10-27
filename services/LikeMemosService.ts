import { Knex } from 'knex';

export class LikeMemosService {
	constructor(private knex: Knex) {}

	async getLikeMemos(user_id: string) {
		const likedMemos = await this.knex
			.select('*')
			.from('users')
			.innerJoin('likes', 'likes.user_id', 'users.id')
			.innerJoin('memos', 'likes.memo_id', 'memos.id')
			.where('users.id', user_id);
		return likedMemos;
	}

	async updateLikeMemos(user_id: number, memo_id: number) {
		const previousLikeRecord = await this.knex
			.select('*')
			.from('likes')
			.where('user_id', user_id)
			.andWhere('memo_id', memo_id);
		if (!previousLikeRecord.length) {
            await this.knex("likes").insert({
                user_id: user_id,
                memo_id: memo_id
            });
			return { status: 'success' };
		} else {
			return { status: 'duplicated like' };
		}
	}

	async deleteLikeMemos(user_id: number, memo_id: number) {
        await this.knex("likes").where("user_id",user_id).andWhere("memo_id",memo_id).del();
		return { status: 'success' };
	}
}
