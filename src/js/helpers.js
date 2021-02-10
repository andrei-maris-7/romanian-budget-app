// HELPERS

const addMovUpdate = function (mov) {
  // Update State
  state.itemID++;
  state.movements.push(mov);

  // Update UI

  updateUI(state);
  updateStorage(state.movements);
};

const createDate = function () {
  const date = new Date();
  const movDate = formatMovementDate(date, state.locale);

  return movDate;
};

const clearFields = function (elem) {
  `${elem}Amount`.value = "";
  `${elem}Description`.value = "";
};
