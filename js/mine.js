import { setCookie, getCookie } from './cookie.js';

const EXPLOSION_MSGS = [
    "Boom! You hit a landmine!",
    "Kaboom! Mine exploded!",
    "Ouch! Landmine triggered!",
    "Bang! You stepped on a mine!",
    "Blown up! That mine got you!",
    "Whoops! The mine went off!",
    "Explosion! Minefield 1, You 0.",
    "Crash! The landmine exploded!",
    "Boom! Not your lucky day!",
    "Blast! Mine went off!"
];

export function loadMine() {
	const button = document.createElement('button')
	const mine = document.createElement('img');
	const minetext = document.createElement('p')

	button.setAttribute('style', 'cursor: pointer;')
	button.onclick = explodeMine;
	button.setAttribute('style', 'display: flex; position: fixed; right: 30px; bottom: 55px; width: 4rem; height: auto; justify-content: center; transform: rotate(-15deg); background-color: transparent; cursor: pointer; border: none; padding: 0; margin: 0; z-index: 99;');

	mine.id = "landmine"
	mine.src = "../images/Landmine.png"
	mine.setAttribute('style', 'width: 3rem; height: auto; position: absolute; bottom:0');

	minetext.id = "mine-text"

	minetext.setAttribute('style', 'position: fixed; right: 100px; bottom: 55px; width: auto; height: auto; text-align: right; text-anchor: right;');

	button.appendChild(mine);
	document.body.appendChild(button);
	document.body.appendChild(minetext);
}

function explodeMine(event) {
	const minetext = document.getElementById("mine-text");

	if (Math.random() < 0.05) {
		const mine = event.target;

		const count = Number(getCookie("landmine_count") || 0);
		console.log(count);
		setCookie("landmine_count", count + 1);

		minetext.textContent = EXPLOSION_MSGS[Math.floor(Math.random() * EXPLOSION_MSGS.length)];
		minetext.hidden = false;

		mine.src = "../images/Landmine_Exploded.png"; 
		setTimeout(() => {
			mine.src = "../images/Landmine.png";
		}, 500); 
		setTimeout(() => {
			minetext.hidden = true;
		}, 500)
	}
}