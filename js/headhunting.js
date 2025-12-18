import { setCookie, getCookie } from './cookie.js';
import { loadOpSelectButtons } from "./op_select.js"
import { filterOperators } from "./data/operators.js"
import { database, auth } from "./database/firebase.js"
import { ref, push, set, get, query, remove, orderByChild, child } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js"

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

let pulls = 0;
let gotRateUp = false;
let rate6StarCount = 0;
let limit6StarCount = 0;
let total6StarCount = 0;
let guaranteed5StarCounter = 0;
let total5StarCount = 0;
let total4StarCount = 0;
let pityCounter = 0;
let pityRate = SOFT_PITY_BASE_RATE;

let simAddedPulls = 0;
let simAddedLimited6Stars = 0;
let simAdded6Stars = 0;
let simAdded5Stars = 0;
let simAdded4Stars = 0;

let simPulledRarities = []

export let selectedOps = {
  rateUpOp: "",
  limited1Op: "",
  limited2Op: ""
}

const colorMapping = {
  4: '#503e73',
  5: '#f3cf5aff',
  6: '#fd4f3fff',
  7: '#fd4f3fff',
  8: '#fd4f3fff'
}

checkHHCookies();
updateHHStats();
loadSelectedOps();
loadOpSelectButtons();
displayHHHistory();

document.getElementById("1-pull-button").onclick = function() { simulatePulls(1); };
document.getElementById("10-pull-button").onclick = function() { simulatePulls(10); };

function checkHHCookies() {
  pulls = Number(getCookie("HH_pulls") || 0);
  gotRateUp = Boolean(getCookie("HH_gotRateUp") || false)
  rate6StarCount = Number(getCookie("HH_rate6StarCount") || 0);
  limit6StarCount = Number(getCookie("HH_limit6StarCount") || 0);
  total6StarCount = Number(getCookie("HH_total6StarCount") || 0);
  guaranteed5StarCounter = Number(getCookie("HH_guaranteed5StarCounter") || 0);
  total5StarCount = Number(getCookie("HH_total5StarCount") || 0);
  total4StarCount = Number(getCookie("HH_total4StarCount") || 0);
  pityCounter = Number(getCookie("HH_pityCounter") || 0);
  pityRate = Number(getCookie("HH_pityRate") || SOFT_PITY_BASE_RATE);
  selectedOps["rateUpOp"] = String(getCookie("HH_rateUpOp") || "");
  selectedOps["limited1Op"] = String(getCookie("HH_limited1Op") || "");
  selectedOps["limited2Op"] = String(getCookie("HH_limited2Op") || "");
}
 
function updateHHCookies() {
  setCookie("HH_pulls", pulls);
  setCookie("HH_gotRateUp", gotRateUp);
  setCookie("HH_rate6StarCount", rate6StarCount);
  setCookie("HH_limit6StarCount", limit6StarCount);
  setCookie("HH_total6StarCount", total6StarCount);
  setCookie("HH_guaranteed5StarCounter", guaranteed5StarCounter);
  setCookie("HH_total5StarCount", total5StarCount);
  setCookie("HH_total4StarCount", total4StarCount);
  setCookie("HH_pityCounter", pityCounter);
}

function loadSelectedOps() {
  for(const op in selectedOps) {
    if(selectedOps[op] != "") {
      if(op === "rateUpOp") {
        document.getElementById("rate-up-button").textContent = selectedOps[op]
      }
      else if(op === "limited1Op") {
        document.getElementById("limited1-button").textContent = selectedOps[op]
      }
      else if(op === "limited2Op") {
        document.getElementById("limited2-button").textContent = selectedOps[op]
      }
    }
  }
}

function updateHHStats() {
  let arsenalCount = total6StarCount * SIX_STAR_ARSENAL + total5StarCount * FIVE_STAR_ARSENAL + total4StarCount * FOUR_STAR_ARSENAL;

  const resultHTML = `
    <div>
		<p><strong>Gacha Stats</strong></p>
		<p>---------------------------------------------</p>
    <p><strong>Total pulls performed:</strong> ${pulls}</p>
		<ul>
			<li><strong>Rate-up 6* pulls:</strong> ${rate6StarCount} rate-up operators</li>
      <li><strong>Limited 6* pulls:</strong> ${limit6StarCount} limited operators</li>
			<li><strong>Number of 6* (Including rate-up and limited 6*):</strong> ${total6StarCount} operators</li>
			<li><strong>Number of 5*:</strong> ${total5StarCount} operators</li>
			<li><strong>Number of 4*:</strong> ${total4StarCount} operators</li>
			<li><strong>Arsenal tokens:</strong> ${arsenalCount} tokens</li>
		</ul>
    <ul>
    	<li><strong>Pulls until guaranteed 6*:</strong> ${80 - pityCounter} pulls</li>
			<li><strong>Pulls until guaranteed 5*:</strong> ${10 - guaranteed5StarCounter} pulls</li>
      ${gotRateUp ? '' : `<p><strong>Pulls untill guaranteed rate-up 6*:</strong> ${120 - pulls}</p>`}
      <br>
			<li><strong>Pity rate:</strong> ${pityRate.toFixed(2)}</li>
		</ul>
    <div>
	`;

	document.getElementById('total-stats').innerHTML = resultHTML;
}

function HHanimation() {
  const pullsContainer = document.getElementById("pull-container"); 
  pullsContainer.innerHTML = '';

  simPulledRarities.forEach(item => {
    const newDiv = document.createElement("div");

    newDiv.classList.add("pull-divs");

    newDiv.style.backgroundColor = colorMapping[item] || 'grey'; 
    const pulledOp = operatorSelect(item);
    newDiv.textContent = pulledOp;

    if(item === 8) {
      newDiv.style.border = "5px var(--primary-accent) solid"
    }

    pullsContainer.appendChild(newDiv);
    addHHHistory(pulledOp);
  });
  displayHHHistory();
}

function operatorSelect(rarity) {
  if (rarity === 4) {
    const fourStarOps = filterOperators({ rarity: 4 })
    var keys = Object.keys(fourStarOps);
    return fourStarOps[keys[keys.length * Math.random() << 0]].name
  }
  if (rarity === 5) {
    const fiveStarOps = filterOperators({ rarity: 5 })
    var keys = Object.keys(fiveStarOps);
    return fiveStarOps[keys[keys.length * Math.random() << 0]].name
  }
  if (rarity === 6) {
    const sixStarOps = filterOperators({ rarity: 6 });
    const keys = Object.keys(sixStarOps);

    const filteredKeys = keys.filter(key => {
      const operatorName = sixStarOps[key].name;
      return !Object.values(selectedOps).includes(operatorName); 
    });

    return sixStarOps[filteredKeys[filteredKeys.length * Math.random() << 0]].name;
  }
  if (rarity === 7) {
    return Math.random() < 0.5 ? selectedOps["limited1Op"] : selectedOps["limited2Op"];
  }
  if (rarity === 8) {
    return selectedOps["rateUpOp"];
  }
}

function simulatePulls(num = 1) {
  document.getElementById("1-pull-button").disabled = true;
  document.getElementById("10-pull-button").disabled = true;

  checkHHCookies();

  simAddedPulls = 0;
  simAddedLimited6Stars = 0;
  simAdded6Stars = 0;
  simAdded5Stars = 0;
  simAdded4Stars = 0;

  simPulledRarities = [];

  for (let _ = 0; _ < num; _++) {
    pulls++;
    simAddedPulls++;
    pityCounter++;

    // Add limited 6* for every 240 pulls
    if (pulls % RATE_UP_TOKEN_INTERVAL === 0) {
      rate6StarCount++;
      simAddedLimited6Stars++;
      total6StarCount++;
      simAdded6Stars++;
      pityRate = SOFT_PITY_BASE_RATE;
      simPulledRarities.push(8)
    }

    // Add limited 6* on the 120th pull
    if (!gotRateUp && pulls === RATEUP_GUARANTEE) {
      rate6StarCount++;
      simAddedLimited6Stars++;
      total6StarCount++;
      simAdded6Stars++;
      pityRate = SOFT_PITY_BASE_RATE;
      pityCounter = 0;
      guaranteed5StarCounter = 0;
      simPulledRarities.push(8)
    }

    // If at hard pity, pull 6* operator, with 50% chance of being limited 6*
    if (pityCounter === HARD_PITY_INTERVAL) {
      pityCounter = 0;
      if (Math.random() < 0.5) {
        rate6StarCount++;
        simAddedLimited6Stars++;
        gotRateUp = true;
        simPulledRarities.push(8)
      }
      else if (Math.random() < LIMIT_SIX_STAR_RATE) {
        simPulledRarities.push(7)
        limit6StarCount++;
      }
      else {
        simPulledRarities.push(6)
      }
      total6StarCount++;
      simAdded6Stars++;
      pityRate = SOFT_PITY_BASE_RATE;
      guaranteed5StarCounter = 0;
    }

    // Otherwise, check soft pity
    else {
      // If passed soft pity, pull 6* operator, with 50% chance of being limited 6*
      if (Math.random() < pityRate) {
        pityCounter = 0;
        if (Math.random() < 0.5) {
          rate6StarCount++;
          simAddedLimited6Stars++;
          gotRateUp = true;
          simPulledRarities.push(8)
        }
        else if (Math.random() < LIMIT_SIX_STAR_RATE) {
          simPulledRarities.push(7)
          limit6StarCount++;
        }
        else {
          simPulledRarities.push(6)
        }
        total6StarCount++;
        simAdded6Stars++;
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
  updateHHCookies();
  updateHHStats();
  HHanimation();

  document.getElementById("1-pull-button").disabled = false;
  document.getElementById("10-pull-button").disabled = false;
}

async function addHHHistory(operatorName) {
  const userId = auth.currentUser?.uid;
  if(!userId) {
    return;
  }

  try {
    const date = new Date().toISOString();
    const HHHistoryRef = ref(database, userId + "/hh-history/");
    const newHHHistoryRef = push(HHHistoryRef)

    await set(newHHHistoryRef, {
      date, operatorName
    });

    await limitHHHistory(HHHistoryRef);
  }
  catch(err) {
    console.error("Error adding history entry: ", err);
  }
}

async function limitHHHistory(hhHistoryRef) {
  try {
    const historyQuery = query(hhHistoryRef, orderByChild("date"));
    let snapshot = await get(historyQuery);

    if (snapshot.exists()) {
      let entries = snapshot.val();
      let entriesCount = Object.keys(entries).length;

      while (entriesCount > 80) {
        console.log(entriesCount);
        const oldestKey = Object.keys(entries)[0];
        const oldestEntryRef = child(hhHistoryRef, oldestKey);

        await remove(oldestEntryRef);

        snapshot = await get(historyQuery); 
        if (snapshot.exists()) {
          entries = snapshot.val();
          entriesCount = Object.keys(entries).length; 
        }
      }
    }
  } catch (error) {
    console.error("Error checking and limiting history: ", error);
  }
}

async function displayHHHistory() {
  const userId = auth.currentUser?.uid;
  if(!userId) {
    return;
  }

  try {
    const HHHistoryRef = ref(database, userId + "/hh-history/");;

    const historyContainer = document.getElementById("hh-history");
    if (!historyContainer) return;

    historyContainer.innerHTML = "";

    const historyQuery = query(HHHistoryRef, orderByChild("date"));
    const snapshot = await get(historyQuery);

    if (!snapshot.exists()) {
      historyContainer.innerHTML = "<p>No history yet.</p>";
      return;
    }

    const entries = snapshot.val();

    const sortedEntries = Object.values(entries).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    for (const entry of sortedEntries) {
      const item = document.createElement("div");
      item.className = "hh-history-item";

      const op = document.createElement("div");
      op.className = "hh-weapon";
      op.textContent = entry.operatorName;

      const date = document.createElement("div");
      date.className = "hh-date";
      date.textContent = new Date(entry.date).toLocaleString();

      item.appendChild(op);
      item.appendChild(date);
      historyContainer.appendChild(item);
    }

  } catch (error) {
    console.error("Error rendering AE history:", error);
  }
}