import { checkUser } from "./database/handle-user.js"
import { loadUserMenu } from "./user_menu.js"
import { loadLogin } from "./login.js"

export function loadUserButton() {
  const button = document.getElementById("user-button");
  if (checkUser() != "Guest") {
    button.removeEventListener('click', loadLogin);
    button.addEventListener('click', loadUserMenu);
  } else {
    button.removeEventListener('click', loadUserMenu);
    button.addEventListener('click', loadLogin);
  }  
}