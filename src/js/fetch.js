const addDeposit = async function () {
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

const addEURDeposit = async function () {
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

const addExpense = async function () {
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

  clearFields("inputExpense");

  // inputExpenseAmount.value = "";
  // inputExpenseDescription.value = "";
};

// FIRST REFACTORING

const addMovement = async function (e, type) {
  e.preventDefault();
  const date = new Date();
  const movDate = formatMovementDate(date, state.locale);

  let value, movDescription;

  if (type === "deposit") {
    value = Number(inputDepositAmount.value);
    movDescription = inputDepositDescription.value;

    const curMovement = {
      movement: value,
      movementEUR: Math.round(await reverseExchange(value)),
      description: movDescription,
      type: "deposit",
      date: movDate,
      id: state.itemID,
    };

    inputDepositAmount.value = "";
    inputDepositDescription.value = "";

    return curMovement;
  }

  if (type === "depositEUR") {
    value = Number(inputDepositEuroAmount.value);
    movDescription = inputDepositEuroDescription.value;

    const curMovement = {
      movement: Math.round(await setExchange(value)),
      movementEUR: value,
      description: movDescription,
      type: "depositEUR",
      date: movDate,
      id: state.itemID,
    };

    inputDepositEuroAmount.value = "";
    inputDepositEuroDescription.value = "";

    return curMovement;
  }

  if (type === "expense") {
    value = Number(inputExpenseAmount.value);
    movDescription = inputExpenseDescription.value;

    const curMovement = {
      movement: -value,
      movementEUR: Math.round(await reverseExchange(-value)),
      description: movDescription,
      type: "expense",
      date: movDate,
      id: state.itemID,
    };

    inputExpenseAmount.value = "";
    inputExpenseDescription.value = "";

    return curMovement;
  }

  if (!value > 0) return;

  state.itemID++;
  state.movements.push(curMovement);

  // Update UI

  updateUI(state);
  updateStorage(state.movements);
};

// INITIAL CODE

btnDeposit.addEventListener("click", async function (e) {
  e.preventDefault();

  // Add movement
  const depositValue = Number(inputDepositAmount.value);
  const descriptionValue = inputDepositDescription.value;

  // const depositDate = new Date().toISOString().slice(0, 10);
  const date = new Date();
  const depositDate = formatMovementDate(date, state.locale);

  if (depositValue > 0) {
    const curMovement = {
      movement: depositValue,
      movementEUR: Math.round(await reverseExchange(depositValue)),
      description: descriptionValue,
      type: "deposit",
      date: depositDate,
      id: state.itemID,
    };

    state.itemID++;
    state.movements.push(curMovement);
  }

  // Update UI

  // Resetting

  inputDepositAmount.value = "";
  inputDepositDescription.value = "";

  updateUI(state);
  updateStorage(state.movements);

  console.log(state.movements);
});

btnDepositEUR.addEventListener("click", async function (e) {
  e.preventDefault();
  const depositValue = Number(inputDepositEuroAmount.value);
  const descriptionValue = inputDepositEuroDescription.value;

  // const depositDate = new Date().toISOString().slice(0, 10);
  const date = new Date();
  const depositDate = formatMovementDate(date, state.locale);

  if (depositValue > 0) {
    const curMovement = {
      movement: Math.round(await setExchange(depositValue)),
      movementEUR: depositValue,
      description: descriptionValue,
      type: "depositEUR",
      date: depositDate,
      id: state.itemID,
    };

    state.itemID++;
    state.movements.push(curMovement);
  }

  // Update UI

  // Resetting

  inputDepositEuroAmount.value = "";
  inputDepositEuroDescription.value = "";

  updateUI(state);
  updateStorage(state.movements);

  console.log(state.movements);
});

btnExpense.addEventListener("click", async function (e) {
  e.preventDefault();

  // Add expense
  const expenseValue = Number(inputExpenseAmount.value);
  const descriptionValue = inputExpenseDescription.value;

  const date = new Date();
  const expenseDate = formatMovementDate(date, state.locale);

  if (expenseValue > 0) {
    const curMovement = {
      movement: -expenseValue,
      movementEUR: Math.round(await reverseExchange(-expenseValue)),
      description: descriptionValue,
      type: "expense",
      date: expenseDate,
      id: state.itemID,
    };

    state.itemID++;
    state.movements.push(curMovement);
    console.log(state.movements);
  }

  // Update UI

  updateUI(state);
  updateStorage(state.movements);

  inputExpenseAmount.value = "";
  inputExpenseDescription.value = "";

  console.log(state.movements);
});
