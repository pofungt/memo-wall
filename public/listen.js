import { getMemos } from './getMemos.js';

export function listen() {
	const parents = document.querySelectorAll('.outer-memo');
	const updateButtons = document.querySelectorAll('.writepad');
	const deleteButtons = document.querySelectorAll('.bin');
	const likeButtons = document.querySelectorAll('.heart');
	const unlikeButtons = document.querySelectorAll('.cracked-heart');

	updateButtons.forEach((element, index) => {
		element.addEventListener('click', async function () {
			const parent = parents[index];
			const textarea = parent.querySelector('.memo');
			let updateObj = {
				content: textarea.value.trim()
			};
			const res = await fetch(`/memo/${parent.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updateObj)
			});
			const memos = await res.json();
			if (!memos.error_msg) {
				getMemos(memos);
				listen();
			}
		});
	});

	deleteButtons.forEach((element, index) => {
		element.addEventListener('click', async function () {
			const parent = parents[index];
			const res = await fetch(`/memo/${parent.id}`, {
				method: 'DELETE'
			});
			const memos = await res.json();
			if (!memos.error_msg) {
				getMemos(memos);
				listen();
			}
		});
	});

	likeButtons.forEach((element, index) => {
		element.addEventListener('click', async function () {
			const parent = parents[index];
			const res = await fetch(`/like_memos/${parent.id}`, {
				method: 'PUT'
			});
			await res.json();
		});
	});

	unlikeButtons.forEach((element, index) => {
		element.addEventListener('click', async function () {
			const parent = parents[index];
			const res = await fetch(`/like_memos/${parent.id}`, {
				method: 'DELETE'
			});
			await res.json();
		});
	});
}
