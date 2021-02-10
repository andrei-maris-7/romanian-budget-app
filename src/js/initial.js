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
