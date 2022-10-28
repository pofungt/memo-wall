import { getMemos } from './getMemos.js';
import { listen } from './listen.js';


async function start() {
	const socket = await io.connect();
	
	socket.on('new-memo', async (data) => {
		getMemos(data);
	});
	const res = await fetch('/memo');
	const memos = await res.json();
	getMemos(memos);

	const res_login = await fetch('/login', {
		method: 'GET'
	});
	const loginStatus = await res_login.json();
	if (loginStatus.status) {
		document.getElementById('login-form').style.display = 'none';
		document.getElementById('greeting').innerHTML = `Hi, admin user!`;
	}

	listen();

	// Add event listener for new content and file submit
	document
		.querySelector('#file-submit')
		.addEventListener('submit', async function (e) {
			e.preventDefault();

			const form = e.target;
			const formData = new FormData();

			formData.append('content', form.content.value);
			formData.append('image', form.image.files[0]);

			const res = await fetch('/memo', {
				method: 'POST',
				body: formData
			});
			const memos = await res.json();
			form.reset();
			getMemos(memos);
			listen();
		});

	// Add event listener for login username and password submit
	document
		.querySelector('#login-submit')
		.addEventListener('submit', async function (e) {
			e.preventDefault();
			const form = e.target;
			let formObj = {
				username: form.username.value,
				password: form.password.value
			};

			const res = await fetch('/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formObj)
			});
			const result = await res.json();
			form.reset();
			if (result.status) {
				document.getElementById('login-form').style.display = 'none';
				alert('Login Successful!');
				document.getElementById(
					'greeting'
				).innerHTML = `Hi, ${result.user}!`;
			} else {
				alert('Login Failed!');
			}
		});
}

start();
