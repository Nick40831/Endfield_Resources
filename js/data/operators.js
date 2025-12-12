const operators = [
  { name: "Akekuri", role: "Vanguard", element: "Heat", weapon: "Sword", rarity: 4 },
  { name: "Alesh", role: "Vanguard", element: "Cryo", weapon: "Sword", rarity: 5 },
  { name: "Antal", role: "Support", element: "Electric", weapon: "Orbiter", rarity: 4 },
  { name: "Ardelia", role: "Support", element: "Nature", weapon: "Orbiter", rarity: 6 },
  { name: "Arclight", role: "Vanguard", element: "Electric", weapon: "Sword", rarity: 5 },
  { name: "Avywenna", role: "Striker", element: "Electric", weapon: "Polearm", rarity: 5 },
  { name: "Catcher", role: "Defender", element: "Physical", weapon: "Greatsword", rarity: 4 },
  { name: "Chen Qianyu", role: "Guard", element: "Physical", weapon: "Sword", rarity: 5 },
  { name: "Da Pan", role: "Striker", element: "Physical", weapon: "Greatsword", rarity: 5 },
  { name: "Ember", role: "Defender", element: "Heat", weapon: "Greatsword", rarity: 6 },
  { name: "Endministrator", role: "Guard", element: "Physical", weapon: "Sword", rarity: 6 },
  { name: "Estella", role: "Guard", element: "Cryo", weapon: "Polearm", rarity: 4 },
  { name: "Fluorite", role: "Caster", element: "Nature", weapon: "Gun", rarity: 4 },
  { name: "Gilberta", role: "Support", element: "Nature", weapon: "Orbiter", rarity: 6 },
  { name: "Laevatain", role: "Striker", element: "Heat", weapon: "Sword", rarity: 6 },
  { name: "Last Rite", role: "Striker", element: "Cryo", weapon: "Greatsword", rarity: 6 },
  { name: "Lifeng", role: "Guard", element: "Physical", weapon: "Polearm", rarity: 6 },
  { name: "Perlica", role: "Caster", element: "Electric", weapon: "Orbiter", rarity: 5 },
  { name: "Pogranichnik", role: "Vanguard", element: "Physical", weapon: "Sword", rarity: 6 },
  { name: "Snowshine", role: "Defender", element: "Cryo", weapon: "Greatsword", rarity: 5 },
  { name: "Wulfgard", role: "Caster", element: "Heat", weapon: "Gun", rarity: 5 },
  { name: "Xaihi", role: "Support", element: "Cryo", weapon: "Orbiter", rarity: 5 },
  { name: "Yvonne", role: "Caster", element: "Cryo", weapon: "Gun", rarity: 6 }
];

// const operatorsByName = Object.fromEntries(
//   operatorsArray.map(op => [op.name, { ...op, name: undefined }])
// );

export function filterOperators(criteria) {
  return operators.filter(op =>
    Object.entries(criteria).every(([key, value]) => op[key] === value)
  );
}

// // Find all rarity 6 operators
// const rarity6 = filterOperators(operatorsArray, { rarity: 6 });

// // Find all Cryo Vanguards
// const cryoVanguards = filterOperators(operatorsArray, { element: "Cryo", role: "Vanguard" });

// console.log(rarity6);
// console.log(cryoVanguards);