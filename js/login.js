import { userLogin, userSignup, checkUser } from "./database/handle-user.js";

let isSignup = false;

function loadPopup() {
	if (checkUser() === "Guest") {
		fetch('../components/login.html') 
		.then(response => response.text())
		.then(html => {
			document.body.insertAdjacentHTML('beforeend', html);

			document.getElementById('overlay').addEventListener('click', closeLoginPopup);
			document.getElementById('submit-button').addEventListener('click', handleLoginSubmit);
			document.getElementById('switch-form').addEventListener('click', toggleFormMode);
		})
		.catch(error => console.error('Error loading popup HTML:', error));
	}
}

function toggleFormMode() {
	isSignup = !isSignup;

	const title = document.getElementById("popup-title");
	const usernameField = document.getElementById("username");
	const switchText = document.getElementById("switch-form");
	const submitButton = document.getElementById("submit-button");

	if (isSignup) {
		title.textContent = "Sign Up";
		switchText.textContent = "Click here to Login";
		usernameField.hidden = false;
		submitButton.textContent = "Sign Up";
	} else {
		title.textContent = "Login";
		switchText.textContent = "Click here to Sign Up";
		usernameField.hidden = true;
		submitButton.textContent = "Login";
	}
}

function closeLoginPopup() {
	document.getElementById('login-popup').remove();
	document.getElementById('overlay').remove();
}

async function handleLoginSubmit(event) {
	event.preventDefault();

	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const username = document.getElementById('username').value;

	if (isSignup) {
		if (userSignup(email, username, password)) {
			closeLoginPopup();
		}
	} else {
		if (userLogin(email, password)) {
			closeLoginPopup();
		}
	}
}

export function loadLoginButton() {
	document.getElementById("user-menu").addEventListener('click', loadPopup);
}