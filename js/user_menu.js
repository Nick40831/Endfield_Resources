import { userLogout } from "./database/handle-user.js";

export function loadUserMenu() {
  fetch('../components/user_menu.html') 
  .then(response => response.text())
  .then(html => {
    document.body.insertAdjacentHTML('beforeend', html);

    document.getElementById('overlay').addEventListener('click', closeUserMenu);
    document.getElementById('log-out-button').addEventListener('click', handleLogout);
  })
  .catch(error => console.error('Error loading popup HTML:', error));
}

async function handleLogout(event) {
  event.preventDefault();

  userLogout();
  closeUserMenu();
}

function closeUserMenu() {
	document.getElementById('user-popup').remove();
	document.getElementById('overlay').remove();
}