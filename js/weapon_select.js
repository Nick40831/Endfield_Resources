import { filterWeapons } from "./data/weapons.js"
import { selectedWeapon } from "./arsenal.js"
import { setCookie } from './cookie.js';

function loadPopup(event) {
  fetch('../components/weapon_select.html') 
  .then(response => response.text())
  .then(html => {
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById('overlay').addEventListener('click', closeLoginPopup);
    const weapons = filterWeapons({rarity: 6});
    const container = document.getElementById("weapon-container");
    weapons.forEach(weapon => {
      if(weapon.name === selectedWeapon["rateUpWeapon"]) {
        return;
      }
      const weaponPortrait = document.createElement("button");
      weaponPortrait.id = "portait-button";
      weaponPortrait.textContent = weapon.name;
      weaponPortrait.onclick = () => {selectOp(event.target, weapon.name)};
      container.appendChild(weaponPortrait);
    });
  })
  .catch(error => console.error('Error loading popup HTML:', error));
}

function closeLoginPopup() {
  document.getElementById('weapon-popup').remove();
  document.getElementById('overlay').remove();
}

function selectOp(target, name) {
  if(target.id === "rate-up-button") {
    selectedWeapon["rateUpWeapon"] = name;
    setCookie("AE_rateUpWeapon", selectedWeapon["rateUpWeapon"]);
  }
  target.textContent = name;
  lockPull();
  closeLoginPopup();
}

export function loadWeaponSelectButton() {
  const weaponButtons = document.getElementsByClassName("weapon-button");
  for(const button of weaponButtons) {
    button.onclick = loadPopup;
  }
  lockPull();
}

function lockPull() {
  const buttons = document.getElementById("pull-buttons");
  const message = document.getElementById("pull-warning");
  const pullButtons = buttons.querySelectorAll("button");

  if (Object.values(selectedWeapon).some(value => value === "")) {
    message.hidden = false;
    pullButtons.forEach(button => button.disabled = true);  
  } else {
    message.hidden = true;
    pullButtons.forEach(button => button.disabled = false); 
  }
}
