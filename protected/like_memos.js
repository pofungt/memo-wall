window.onload = async () => {
	// should be inside window.onload
	const searchParams = new URLSearchParams(location.search);
	const userId = searchParams.get('user_id');

	// Use the id to fetch data from
	const res = await fetch(`/like_memos?user=${userId}`);
	const liked_memos = await res.json();

	const header = document.querySelector('h1');
	header.innerHTML = `User ${userId} liked ${liked_memos.length} pages:`;

	const memoList = document.querySelector('#board-column');
	memoList.innerHTML = '';
	for (const memo of liked_memos) {
		memoList.innerHTML += `
            <textarea type="text" name="content" class="memo">${memo.content}</textarea>
        `;
	}
};
