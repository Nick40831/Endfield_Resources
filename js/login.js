import { userLogin, userSignup, userPasswordReset } from "./database/handle-user.js";

let isSignup = false;
let isReset = false;

export function loadLogin() {
	fetch('../components/login.html') 
	.then(response => response.text())
	.then(html => {
		document.body.insertAdjacentHTML('beforeend', html);

		document.getElementById('overlay').addEventListener('click', closeLoginPopup);
		document.getElementById('submit-button').addEventListener('click', handleLoginSubmit);
		document.getElementById('reset-form').addEventListener('click', toggleFormMode);
		document.getElementById('switch-form').addEventListener('click', toggleFormMode);
	})
	.catch(error => console.error('Error loading popup HTML:', error));
}

function toggleFormMode(event) {
	const pressedButton = event.target.id;

	const title = document.getElementById("popup-title");
	const usernameField = document.getElementById("username");
	const passwordField = document.getElementById("password");
	const switchText = document.getElementById("switch-form");
	const submitButton = document.getElementById("submit-button");

	if (pressedButton === "switch-form") {
		isSignup = !isSignup;
		isReset = false;
		if (isSignup) {
			title.textContent = "Sign Up";
			switchText.textContent = "Click here to Login";
			usernameField.hidden = false;
			passwordField.hidden = false;
			submitButton.textContent = "Sign Up";
		} else {
			title.textContent = "Login";
			switchText.textContent = "Click here to Sign Up";
			usernameField.hidden = true;
			passwordField.hidden = false;
			submitButton.textContent = "Login";
		}
	}
	else if (pressedButton === "reset-form") {
		isSignup = true;
		isReset = true;
		title.textContent = "Password Reset";
		switchText.textContent = "Click here to Login";
		usernameField.hidden = true;
		passwordField.hidden = true;
		submitButton.textContent = "Send Reset";
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

	if (isReset) {
		if(userPasswordReset(email)) {
			closeLoginPopup();
		}
	}
	else if (isSignup) {
		if (userSignup(email, username, password)) {
			closeLoginPopup();
		}
	} else {
		if (userLogin(email, password)) {
			closeLoginPopup();
		}
	}
}