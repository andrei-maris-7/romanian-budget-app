const rows = document.querySelectorAll(".movements_row");

const rowsArray = Array.from(rows);

console.log(rows);

const calcDisplaySummary = function (acc) {
  const movementsArr = acc.movements.map((elem) => elem.movement);

  const incomes = movementsArr
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} RON`;

  const out = movementsArr
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} RON`;
};
