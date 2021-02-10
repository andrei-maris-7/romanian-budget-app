// // Adding movements

const addDeposit = async function (e) {
  e.preventDefault();

  const movDate = createDate();

  const value = Number(inputDepositAmount.value);
  const movDescription = inputDepositDescription.value;

  if (!value > 0) return;

  const curMovement = {
    movement: value,
    movementEUR: Math.round(await reverseExchange(value)),
    description: movDescription,
    type: "deposit",
    date: movDate,
    id: state.itemID,
  };

  addMovUpdate(curMovement);

  inputDepositAmount.value = "";
  inputDepositDescription.value = "";
};

const addEURDeposit = async function (e) {
  e.preventDefault();
  const movDate = createDate();

  const value = Number(inputDepositEuroAmount.value);
  const movDescription = inputDepositEuroDescription.value;

  if (!value > 0) return;

  const curMovement = {
    movement: Math.round(await setExchange(value)),
    movementEUR: value,
    description: movDescription,
    type: "depositEUR",
    date: movDate,
    id: state.itemID,
  };

  addMovUpdate(curMovement);

  inputDepositEuroAmount.value = "";
  inputDepositEuroDescription.value = "";
};

const addExpense = async function (e) {
  e.preventDefault();
  const movDate = createDate();

  const value = Number(inputExpenseAmount.value);
  const movDescription = inputExpenseDescription.value;

  if (!value > 0) return;

  const curMovement = {
    movement: -value,
    movementEUR: Math.round(await reverseExchange(-value)),
    description: movDescription,
    type: "expense",
    date: movDate,
    id: state.itemID,
  };

  addMovUpdate(curMovement);

  inputExpenseAmount.value = "";
  inputExpenseDescription.value = "";
};

// EVENT HANDLERS

btnDeposit.addEventListener("click", addDeposit);

btnDepositEUR.addEventListener("click", addEURDeposit);

btnExpense.addEventListener("click", addExpense);

let movs = movements;

if (sort === true) {
  movs = movements.slice().sort((a, b) => a.movement - b.movement);
}

if (filter === "RON") {
  movs = movements.filter((elem) => elem.currency === "RON");
}

if (filter === "EUR") {
  movs = movements.filter((elem) => elem.currency === "EUR");
}
