import { setCookie, getCookie } from './cookie.js';

// Constants
const HARD_PITY_INTERVAL = 40;
const LIMITED_PITY_INTERVAL = 80;
const FIVE_STAR_RATE = 0.15;
const SIX_STAR_RATE = 0.04;
const RATE_UP_RATE = 0.25;
const GUARANTEED_5_STAR_INTERVAL = 10;
const ARSENAL_PULL_COST = 1980;

let pulls = 0;
let gotLimited = false;
let limited6StarCount = 0;
let total6StarCount = 0;
let guaranteed5StarCounter = 0;
let total5StarCount = 0;
let total4StarCount = 0;
let pityCounter = 0;

let simAddedPulls = 0;
let simAddedLimited6Stars = 0;
let simAdded6Stars = 0;
let simAdded5Stars = 0;
let simAdded4Stars = 0;

let simPulledRarities = []

const colorMapping = {
  4: '#503e73',
  5: '#f3cf5aff',
  6: '#fd4f3fff',
  7: '#fd4f3fff'
}

checkAECookies();
updateAEStats();

document.getElementById("10-pull-button").onclick = function() { simulatePulls(10); };

function checkAECookies() {
  pulls = Number(getCookie("AE_pulls") || 0);
  gotLimited = Boolean(getCookie("AE_gotLimited") || false)
  limited6StarCount = Number(getCookie("AE_limited6StarCount") || 0);
  total6StarCount = Number(getCookie("AE_total6StarCount") || 0);
  guaranteed5StarCounter = Number(getCookie("AE_guaranteed5StarCounter") || 0);
  total5StarCount = Number(getCookie("AE_total5StarCount") || 0);
  total4StarCount = Number(getCookie("AE_total4StarCount") || 0);
  pityCounter = Number(getCookie("AE_pityCounter") || 0);
}

function updateAECookies() {
  setCookie("AE_pulls", pulls);
  setCookie("AE_gotLimited", gotLimited);
  setCookie("AE_limited6StarCount", limited6StarCount);
  setCookie("AE_total6StarCount", total6StarCount);
  setCookie("AE_guaranteed5StarCounter", guaranteed5StarCounter);
  setCookie("AE_total5StarCount", total5StarCount);
  setCookie("AE_total4StarCount", total4StarCount);
  setCookie("AE_pityCounter", pityCounter);
}

function updateAEStats() {
  const resultHTML = `
    <div>
		<p><strong>Gacha Stats</strong></p>
		<p>---------------------------------------------</p>
    <p><strong>Total pulls performed:</strong> ${pulls}</p>
		<ul>
			<li><strong>Rate-up 6* pulls:</strong> ${limited6StarCount} rate-up weapons</li>
			<li><strong>Number of 6* (Including rate-up 6*):</strong> ${total6StarCount} weapons</li>
			<li><strong>Number of 5*:</strong> ${total5StarCount} weapons</li>
			<li><strong>Number of 4*:</strong> ${total4StarCount} weapons</li>
			<li><strong>Arsenal tokens spent:</strong> ${ARSENAL_PULL_COST * pulls} tokens</li>
		</ul>
    <ul>
    	<li><strong>Pulls until guaranteed 6*:</strong> ${40 - pityCounter} pulls</li>
			<li><strong>Pulls until guaranteed 5*:</strong> ${10 - guaranteed5StarCounter} pulls</li>
      ${gotLimited ? '' : `<p><strong>Pulls untill guaranteed rate-up 6*:</strong> ${80 - pulls}</p>`}
      <br>
		</ul>
    <div>
	`;

	document.getElementById('total-stats').innerHTML = resultHTML;
}

function AEanimation() {
  const pullsContainer = document.getElementById("pull-container"); 
  pullsContainer.innerHTML = '';

  simPulledRarities.forEach(item => {
    const newDiv = document.createElement("div");

    newDiv.id = `rarity-${item}`;

    newDiv.style.backgroundColor = colorMapping[item] || 'grey'; 

    newDiv.style.height = "5rem";
    newDiv.style.aspectRatio = "1";
    newDiv.style.margin = "5px";

    if(item === 7) {
      newDiv.style.border = "5px var(--primary-accent) solid"
    }

    pullsContainer.appendChild(newDiv);
  });
}

function simulatePulls(num = 1) {
  document.getElementById("10-pull-button").disabled = true;

  checkAECookies();

  simAddedPulls = 0;
  simAddedLimited6Stars = 0;
  simAdded6Stars = 0;
  simAdded5Stars = 0;
  simAdded4Stars = 0;

  simPulledRarities = []

  for (let _ = 0; _ < num; _++) {
    pulls++;
    simAddedPulls++;
    pityCounter++;

    // Add limited 6* on the 80th pull
    if (!gotLimited && pulls === LIMITED_PITY_INTERVAL) {
      limited6StarCount++;
      simAddedLimited6Stars++;
      total6StarCount++;
      simAdded6Stars++;
      pityCounter = 0;
      guaranteed5StarCounter = 0;
      simPulledRarities.push(7)
    }

    // If at hard pity, pull 6* weapon, with 50% chance of being limited 6*
    if (pityCounter === HARD_PITY_INTERVAL) {
      pityCounter = 0;
      if (Math.random() < RATE_UP_RATE) {
        limited6StarCount++;
        simAddedLimited6Stars++;
        gotLimited = true;
        simPulledRarities.push(7)
      }
      else {
        simPulledRarities.push(6)
      }
      total6StarCount++;
      simAdded6Stars++;
      guaranteed5StarCounter = 0;
    }

    // Otherwise, check standard pull rates
    else {
      if (Math.random() < SIX_STAR_RATE) {
        pityCounter = 0;
        if (Math.random() < RATE_UP_RATE) {
          limited6StarCount++;
          simAddedLimited6Stars++;
          gotLimited = true;
          simPulledRarities.push(7)
        }
        else {
          simPulledRarities.push(6)
        }
        total6StarCount++;
        simAdded6Stars++;
        guaranteed5StarCounter = 0;
      }

      // Else, up soft pity by 5% and finish pull
      else {
        // If nine 4* operators have been pulled, pull 5* operator
        if (guaranteed5StarCounter === GUARANTEED_5_STAR_INTERVAL - 1) {
          total5StarCount++;
          simAdded5Stars++;
          guaranteed5StarCounter = 0;
          simPulledRarities.push(5)
        }

        // Else, try and pull 5*, if failed, pull 4*
        else if (Math.random() < FIVE_STAR_RATE) {
          total5StarCount++;
          simAdded5Stars++;
          guaranteed5StarCounter = 0;
          simPulledRarities.push(5)
        } else {
          total4StarCount++;
          simAdded4Stars++;
          guaranteed5StarCounter++;
          simPulledRarities.push(4)
        }
      }
    }
  }
  updateAECookies();
  updateAEStats();
  AEanimation();

  document.getElementById("10-pull-button").disabled = false;
}