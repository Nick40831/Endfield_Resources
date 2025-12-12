import { filterOperators } from "./data/operators.js"
import { selectedOps } from "./headhunting.js"
import { setCookie } from './cookie.js';

function loadPopup(event) {
  fetch('../components/op_select.html') 
  .then(response => response.text())
  .then(html => {
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById('overlay').addEventListener('click', closeLoginPopup);
    const ops = filterOperators({rarity: 6});
    const container = document.getElementById("operator-container");
    ops.forEach(operator => {
      for(const op in selectedOps) {
        if(operator.name === selectedOps[op]) {
          return;
        }
      }
      const opPortrait = document.createElement("button");
      opPortrait.id = "portait-button";
      opPortrait.textContent = operator.name;
      opPortrait.onclick = () => {selectOp(event.target, operator.name)};
      container.appendChild(opPortrait);
    });
  })
  .catch(error => console.error('Error loading popup HTML:', error));
}

function closeLoginPopup() {
  document.getElementById('op-popup').remove();
  document.getElementById('overlay').remove();
}

function selectOp(target, name) {
  if(target.id === "rate-up-button") {
    selectedOps["rateUpOp"] = name;
    setCookie("HH_rateUpOp", selectedOps["rateUpOp"]);
  }
  else if(target.id === "limited1-button") {
    selectedOps["limited1Op"] = name;
    setCookie("HH_limited1Op", selectedOps["limited1Op"]);
  }
  else if(target.id === "limited2-button") {
    selectedOps["limited2Op"] = name;
    setCookie("HH_limited2Op", selectedOps["limited2Op"]);
  }
  target.textContent = name;
  lockPull();
  closeLoginPopup();
}

export function loadOpSelectButtons() {
  const opButtons = document.getElementsByClassName("op-buttons");
  for(const button of opButtons) {
    button.onclick = loadPopup;
  }
  lockPull();
}

function lockPull() {
  const buttons = document.getElementById("pull-buttons");
  const message = document.getElementById("pull-warning");
  const pullButtons = buttons.querySelectorAll("button");

  if (Object.values(selectedOps).some(value => value === "")) {
    message.hidden = false;
    pullButtons.forEach(button => button.disabled = true);  
  } else {
    message.hidden = true;
    pullButtons.forEach(button => button.disabled = false); 
  }
}

// function checkOpCookies() {
//   selectedOps["rateUpOp"] = String(getCookie("HH_rateUpOp") || "");
//   selectedOps["limited1Op"] = String(getCookie("HH_limited1Op") || "");
//   selectedOps["limited2Op"] = String(getCookie("HH_limited2Op") || "");
// }

// function updateOpCookies() {
//   setCookie("HH_rateUpOp", selectedOps["rateUpOp"]);
//   setCookie("HH_limited1Op", selectedOps["limited1Op"]);
//   setCookie("HH_limited2Op", selectedOps["limited2Op"]);
// }
