let activeMode = "Pulls";
updateLimits()

function updateMode(mode, activeButton) {
	activeMode = mode;
	document.getElementById('inputtext').textContent = mode;

	const buttons = document.querySelectorAll('.modeButton');
	buttons.forEach(button => button.classList.remove('activeButton'));

	activeButton.classList.add('activeButton');
	updateLimits(mode);
}

function updateLimits() {
	let input = document.getElementById("quantityInput");
	let range = document.getElementById("quantitySubtext")

	input.value = 1;
			
	input.onkeyup = function() {
		let value = parseInt(this.value, 10);

		if ((activeMode === "Pulls" && value > 1000) ||
			(activeMode === "Rate-Up Pots" && value > 6) ||
			(activeMode === "10x Arsenal Pulls" && value > 50)) {
			this.value = Math.floor(this.value / 10);  
		}

		if (value < -1) {
			this.value *= -1;  
		}
	};
		
	if (activeMode === "Pulls") {
		input.setAttribute("min", 1);
		input.setAttribute("max", 1000);
		range.textContent = "Range: 1 - 1000";
	}
	else if (activeMode === "Rate-Up Pots") {
		input.setAttribute("min", 1);
		input.setAttribute("max", 6);
		range.textContent = "Range: 1 - 6";
	}
	else if (activeMode === "10x Arsenal Pulls") {
		input.setAttribute("min", 1);
		input.setAttribute("max", 50);
		range.textContent = "Range: 1 - 50";
	}
}

document.getElementById('pullbutton').addEventListener('click', function(event) {
	updateMode("Pulls", event.target);
});

document.getElementById('rateupbutton').addEventListener('click', function(event) {
	updateMode("Rate-Up Pots", event.target);
});

document.getElementById('arsenalbutton').addEventListener('click', function(event) {
	updateMode("10x Arsenal Pulls", event.target);
});

function runSimulation(event) {
	event.target.style.backgroundColor = "var(--secondary-accent)";
	event.target.disabled = true;

	document.getElementById('resultStats').hidden = true;
	document.getElementById('resultText').hidden = false;
	document.getElementById('resultText').textContent = "Running Simulation\r\nPlease Wait";

	setTimeout(() => {
		event.target.style.backgroundColor = "var(--base-color-2)";
		event.target.disabled = false;
	}, 250)
	setTimeout(() => {
		simulation();
	}, 0);
}

function simulation() {
	// Constants
	const SOFT_PITY_BASE_RATE = 0.008;
	const SOFT_PITY_INCREMENT = 0.05;
	const LIMIT_SIX_STAR_RATE = 0.1428;
	const HARD_PITY_INTERVAL = 80;
	const RATEUP_GUARANTEE = 120;
	const RATE_UP_TOKEN_INTERVAL = 240;
	const FIVE_STAR_RATE = 0.08;
	const GUARANTEED_5_STAR_INTERVAL = 10;
	const SIX_STAR_ARSENAL = 2000;
	const FIVE_STAR_ARSENAL = 200;
	const FOUR_STAR_ARSENAL = 20;
	const ARSENAL_PULL_COST = 1980;

	let rateUp6Totals = [];
	let limit6Totals = [];
	let total6Totals = [];
	let total5Totals = [];
	let total4Totals = [];
	let arsenalTotals = [];
	let pullTotals = [];

	let pullQuantity = null; 
	let potQuantity = null;
	let arsenalQuantity = null;

	let quantity = document.getElementById('quantityInput').value;
	let sampleSize = document.getElementById('iterationInput').value;

	quantity = parseInt(quantity, 10);
	sampleSize = parseInt(sampleSize, 10);

	if (!(quantity > 0 && sampleSize > 0)) {
		document.getElementById("resultText").textContent = "Invalid inputs, please enter positive numbers";
		return;
	}

	if (activeMode == 'Pulls') {
		pullQuantity = quantity;
	}
	else if (activeMode == 'Rate-Up Pots') {
		potQuantity = quantity;
	}
	else if (activeMode == "10x Arsenal Pulls") {
		arsenalQuantity = quantity; 
	}
	else {
		throw Error("Invalid Type");
	}

	if (arsenalQuantity !== null) {
		arsenalQuantity *= ARSENAL_PULL_COST; 
	}

	for (let i = 0; i < sampleSize; i++) {
		let pulls = 0;
		let gotRateUp = false;
		let rate6StarCount = 0;
		let limit6StarCount = 0;
		let total6StarCount = 0;
		let guaranteed5StarCounter = 0;
		let total5StarCount = 0;
		let total4StarCount = 0;
		let pityCounter = 0;
		let arsenalCounter = 0;
		let pityRate = SOFT_PITY_BASE_RATE;

		// Select loop exit condition based on input
		let loopExitCondition;
		if (pullQuantity !== null) {
			loopExitCondition = () => pulls >= pullQuantity;
		} else if (potQuantity !== null) {
			loopExitCondition = () => rate6StarCount >= potQuantity;
		} else if (arsenalQuantity !== null) {
			loopExitCondition = () => arsenalCounter >= arsenalQuantity;
		} else {
			throw new Error("At least one of pullQuantity, potQuantity, or arsenalQuantity must be provided.");
		}

		while (!loopExitCondition() && pulls < 2000) {
			pulls++;
			pityCounter++;

			// Add rate-up 6* for every 240 pulls
			if (pulls % RATE_UP_TOKEN_INTERVAL === 0) {
				rate6StarCount++;
				total6StarCount++;
				arsenalCounter += SIX_STAR_ARSENAL;
				pityRate = SOFT_PITY_BASE_RATE;
			}

			// Add rate-up 6* on the 120th pull
			if (!gotRateUp && pulls === RATEUP_GUARANTEE) {
				rate6StarCount++;
				total6StarCount++;
				arsenalCounter += SIX_STAR_ARSENAL;
				pityRate = SOFT_PITY_BASE_RATE;
				pityCounter = 0;
				guaranteed5StarCounter = 0;
			}

			// If at hard pity, pull 6* operator, with 50% chance of being rate-up 6*
			if (pityCounter === HARD_PITY_INTERVAL) {
				pityCounter = 0;
				if (Math.random() < 0.5) {
					rate6StarCount++;
					gotRateUp = true;
				}
				else if (Math.random() < LIMIT_SIX_STAR_RATE) {
					limit6StarCount++;
				}
				total6StarCount++;
				arsenalCounter += SIX_STAR_ARSENAL;
				pityRate = SOFT_PITY_BASE_RATE;
				guaranteed5StarCounter = 0;
			}

			// Otherwise, check soft pity
			else {
				// If passed soft pity, pull 6* operator, with 50% chance of being rate-up 6*
				if (Math.random() < pityRate) {
					pityCounter = 0;
					if (Math.random() < 0.5) {
						rate6StarCount++;
						gotRateUp = true;
					}
					else if (Math.random() < LIMIT_SIX_STAR_RATE) {
						limit6StarCount++;
					}
					total6StarCount++;
					arsenalCounter += SIX_STAR_ARSENAL;
					pityRate = SOFT_PITY_BASE_RATE;
					guaranteed5StarCounter = 0;
				}

				// Else, up soft pity by 5% and finish pull
				else {
					if (pityCounter > 65) {
						pityRate += SOFT_PITY_INCREMENT;
					}

					// If nine 4* operators have been pulled, pull 5* operator
					if (guaranteed5StarCounter === GUARANTEED_5_STAR_INTERVAL - 1) {
						total5StarCount++;
						guaranteed5StarCounter = 0;
						arsenalCounter += FIVE_STAR_ARSENAL;
					}

					// Else, try and pull 5*, if failed, pull 4*
					else if (Math.random() < FIVE_STAR_RATE) {
						total5StarCount++;
						guaranteed5StarCounter = 0;
						arsenalCounter += FIVE_STAR_ARSENAL;
					} else {
						total4StarCount++;
						guaranteed5StarCounter++;
						arsenalCounter += FOUR_STAR_ARSENAL;
					}
				}
			}
		}

		// Append totals to lists
		rateUp6Totals.push(rate6StarCount);
		limit6Totals.push(limit6StarCount);
		total6Totals.push(total6StarCount);
		total5Totals.push(total5StarCount);
		total4Totals.push(total4StarCount);
		arsenalTotals.push(arsenalCounter);
		pullTotals.push(pulls);
	}

	// Calculate averages
	const meanRateUp6 = average(rateUp6Totals);
	const meanLimit6 = average(limit6Totals);
	const mean6 = average(total6Totals);
	const mean5 = average(total5Totals);
	const mean4 = average(total4Totals);
	const meanArsenal = average(arsenalTotals);
	const meanPulls = average(pullTotals);

	// Turn arsenal pulls into 10x arsenal pulls
	const meanArsenalPulls = meanArsenal / ARSENAL_PULL_COST;

	let simulationDescription = '';
	if (pullQuantity !== null) {
			simulationDescription = `${sampleSize} Simulated Runs of ${pullQuantity} Pulls`;
	} else if (potQuantity !== null) {
			simulationDescription = `${sampleSize} Simulated Runs of Pulling ${potQuantity} Rate-Up Pots`;
	} else if (arsenalQuantity !== null) {
			simulationDescription = `${sampleSize} Simulated Runs of Pulling ${Math.floor(arsenalQuantity/1980)} 10x Arsenal Pulls`;
	}

	const resultHTML = `
		<p><strong>${simulationDescription}</strong></p>
		<p>---------------------------------------------</p>
		${pullQuantity === null ? `<p><strong>Mean number of pulls performed:</strong> ${meanPulls.toFixed(2)}</p>` : ''}
		<ul>
			<li><strong>Mean rate-up 6* pulls:</strong> ${meanRateUp6.toFixed(2)} rate-up operators</li>
			<li><strong>Mean limited 6* pulls:</strong> ${meanLimit6.toFixed(2)} limited operators</li>
			<li><strong>Mean number of 6* (Including rate-up 6*):</strong> ${mean6.toFixed(2)} operators</li>
			<li><strong>Mean number of 5*:</strong> ${mean5.toFixed(2)} operators</li>
			<li><strong>Mean number of 4*:</strong> ${mean4.toFixed(2)} operators</li>
			<li><strong>Mean arsenal tokens:</strong> ${meanArsenal.toFixed(2)} tokens</li>
			<li><strong>Mean arsenal pull count:</strong> ${meanArsenalPulls.toFixed(2)} 10x Arsenal Pulls</li>
		</ul>
	`;

	document.getElementById('resultStats').innerHTML = resultHTML;
	document.getElementById('resultStats').hidden = false;
	document.getElementById('resultText').hidden = true;
}

function average(arr) {
	return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}