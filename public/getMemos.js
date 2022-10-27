export async function getMemos(memos) {
	const memoList = document.querySelector('#board-column');
	memoList.innerHTML = '';
	for (const memo of memos) {
		memoList.innerHTML += `
        <div class="outer-memo" id="${memo.id}">
            <textarea type="text" name="content" class="memo">${memo.content}</textarea>
            <div class="icon-button bin">
                <i class="fa-solid fa-trash-can"></i>
            </div>
            <div class="icon-button writepad">
                <i class="fa-solid fa-pen-to-square"></i>
            </div>
			<div class="icon-button heart">
				<i class="fa-solid fa-heart"></i>
			</div>
			<div class="icon-button cracked-heart">
				<i class="fa-solid fa-heart-crack"></i>
			</div>
        </div>
        `;
	}
}
