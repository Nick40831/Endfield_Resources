import { filterOperators } from "./data/operators.js"
import { selectedOps } from "./headhunting.js"

function loadPopup(event) {
  fetch('../components/op_select.html') 
  .then(response => response.text())
  .then(html => {
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById('overlay').addEventListener('click', closeLoginPopup);
    const ops = filterOperators({rarity: 6});
    const container = document.getElementById("operator-container");
    ops.forEach(operator => {
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
  for(const op in selectedOps) {
    console.log(selectedOps[op])
    if(name === selectedOps[op]) {
      return;
    }
  }
  if(target.id === "rate-up-button") {
    selectedOps["rateUpOp"] = name;
  }
  else if(target.id === "limited1-button") {
    selectedOps["limited1Op"] = name;
  }
  else if(target.id === "limited2-button") {
    selectedOps["limited2Op"] = name;
  }
  target.textContent = name;
  closeLoginPopup();
}

export function loadOpSelectButtons() {
  const opButtons = document.getElementsByClassName("op-buttons");

  for(const button of opButtons) {
    button.onclick = loadPopup;
  }
}