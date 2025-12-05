function loadMine() {
	const button = document.createElement('button')
	const mine = document.createElement('img');

	button.setAttribute('style', 'cursor: pointer;')
	button.onclick = explodeMine;

	mine.id = "landmine"
	mine.src = "../images/Landmine.png"
	mine.setAttribute('style', 'position: absolute; right: 30px; bottom: 55px; width: 3rem; height: auto; transform: rotate(-15deg);');

	button.appendChild(mine)
	document.body.appendChild(button)
}

function explodeMine(event) {
	if (Math.random() < 0.9) {
		const mine = event.target;
		let cookie = document.cookie;
		console.log(cookie);
		mine.src = "../images/Landmine_Exploded.png"; 
		setTimeout(() => {
			mine.src = "../images/Landmine.png";
		}, 500); 
	}
}

loadMine()