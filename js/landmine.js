import { setCookie, getCookie } from './cookie.js';

function getMineStats() {
  const text = document.getElementById("stat-text");
  const count = Number(getCookie("landmine_count") || 0);

  text.textContent = "You have stepped on " + count + " landmines!"
}

getMineStats(); 