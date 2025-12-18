import { setCookie, getCookie } from './cookie.js';
import { loadWeaponSelectButton } from "./weapon_select.js"
import { filterWeapons } from "./data/weapons.js"
import { database, auth } from "./database/firebase.js"
import { ref, push, set, get, query, remove, orderByChild, child } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js"


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

export let selectedWeapon = {
  rateUpWeapon: "",
}

checkAECookies();
updateAEStats();
loadSelectedWeapon();
loadWeaponSelectButton();
displayAEHistory();

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
  selectedWeapon["rateUpWeapon"] = String(getCookie("AE_rateUpWeapon") || "");
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

function loadSelectedWeapon() {
  if(selectedWeapon["rateUpWeapon"] != "") {
    document.getElementById("rate-up-button").textContent = selectedWeapon["rateUpWeapon"]
  }
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

    newDiv.classList.add("pull-divs");

    newDiv.style.backgroundColor = colorMapping[item] || 'grey'; 
    const pulledWeapon = weaponSelect(item);
    newDiv.textContent = pulledWeapon;

    if(item === 7) {
      newDiv.style.border = "5px var(--primary-accent) solid"
    }

    pullsContainer.appendChild(newDiv);
    addAEHistory(pulledWeapon);
  });
  displayAEHistory();
}

function weaponSelect(rarity) {
  if (rarity === 4) {
    const fourStarWeapons = filterWeapons({ rarity: 4 })
    var keys = Object.keys(fourStarWeapons);
    return fourStarWeapons[keys[keys.length * Math.random() << 0]].name
  }
  if (rarity === 5) {
    const fiveStarWeapons = filterWeapons({ rarity: 5 })
    var keys = Object.keys(fiveStarWeapons);
    return fiveStarWeapons[keys[keys.length * Math.random() << 0]].name
  }
  if (rarity === 6) {
    const sixStarWeapons = filterWeapons({ rarity: 6 });
    const keys = Object.keys(sixStarWeapons);

    const filteredKeys = keys.filter(key => {
      const weaponName = sixStarWeapons[key].name;
      return !Object.values(selectedWeapon).includes(weaponName); 
    });

    return sixStarWeapons[filteredKeys[filteredKeys.length * Math.random() << 0]].name;
  }
  if (rarity === 7) {
    return selectedWeapon["rateUpWeapon"];
  }
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

async function addAEHistory(weaponName) {
  const userId = auth.currentUser?.uid;
  if(!userId) {
    return;
  }

  try {
    const date = new Date().toISOString();
    const AEHistoryRef = ref(database, userId + "/ae-history/");
    const newAEHistoryRef = push(AEHistoryRef)

    await set(newAEHistoryRef, {
      date, weaponName
    });

    await limitAEHistory(AEHistoryRef);
  }
  catch(err) {
    console.error("Error adding history entry: ", err);
  }
}

async function limitAEHistory(AEHistoryRef) {
  try {
    const historyQuery = query(AEHistoryRef, orderByChild("date"));
    let snapshot = await get(historyQuery);

    if (snapshot.exists()) {
      let entries = snapshot.val();
      let entriesCount = Object.keys(entries).length;

      while (entriesCount > 80) {
        console.log(entriesCount);
        const oldestKey = Object.keys(entries)[0];
        const oldestEntryRef = child(AEHistoryRef, oldestKey);

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

async function displayAEHistory() {
  try {
    auth.authStateReady().then(async () => {
      const user = auth.currentUser;
      if(!user) {
        return;
      }
      const userId = user.uid;

      const AEHistoryRef = ref(database, userId + "/ae-history/");

      const historyContainer = document.getElementById("ae-history");
      if (!historyContainer) return;

      historyContainer.innerHTML = "";

      const historyQuery = query(AEHistoryRef, orderByChild("date"));
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
        item.className = "ae-history-item";

        const weapon = document.createElement("div");
        weapon.className = "ae-weapon";
        weapon.textContent = entry.weaponName;

        const date = document.createElement("div");
        date.className = "ae-date";
        date.textContent = new Date(entry.date).toLocaleString();

        item.appendChild(weapon);
        item.appendChild(date);
        historyContainer.appendChild(item);
      }
    })
  } catch (error) {
    console.error("Error rendering AE history:", error);
  }
}