import { v4 as uuidv4 } from "uuid";

// VARIABILE

const API_KEY = "260995e8ca600b01e5c82830dbc9ff7b";

// SELECTORS

const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelBalanceEUR = document.querySelector(".balance__value--EUR");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnDepositEUR = document.querySelector(".form__btn--depositEUR");
const btnDeposit = document.querySelector(".form__btn--deposit");
const btnExpense = document.querySelector(".form__btn--expense");

const btnSortDescending = document.querySelector(".btn--sort-descending");
const selectedFilter = document.querySelector(".filter__movement-list");
const btnSortAscending = document.querySelector(".btn--sort-ascending");
const btnDeleteMovement = document.querySelector(".movements__delete--btn");

const inputDepositAmount = document.querySelector(
  ".form__input--deposit-amount"
);
const inputDepositDescription = document.querySelector(
  ".form__input--deposit-description"
);

const inputDepositEuroDescription = document.querySelector(
  ".form__input--depositEUR-description"
);
const inputDepositEuroAmount = document.querySelector(
  ".form__input--depositEUR-amount"
);

const inputExpenseAmount = document.querySelector(
  ".form__input--expense-amount"
);
const inputExpenseDescription = document.querySelector(
  ".form__input--expense-description"
);
// const inputTransferAmount = document.querySelector(".form__input--amount");
// const inputTransferTo = document.querySelector(".form__input--to");

// STATE

const state = {
  movements: [],
  balance: 0,
  balanceEUR: 0,
  locale: "en-GB",
  sorted: false,
  itemID: "",
  filter: selectedFilter.value,
};

// const movementsTest = state.movements
//   .slice()
//   .sort((a, b) => a.movement - b.movement);

// console.log(movementsTest);

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

// FUNCTIONS

// //  Local storage

const updateStorage = function (newArr) {
  localStorage.setItem("transactions", JSON.stringify(newArr));
};

// const clearTransactions = function () {
//   localStorage.clear("transactions");
// };

// Exchange

const getExchange = async function () {
  try {
    const res = await fetch(
      `http://data.fixer.io/api/latest?access_key=&base=EUR&symbols=RON,USD`
    );

    const data = await res.json();
    // if (!data.success) throw new Error(`${data.error.info}`);

    return data.rates.RON;
  } catch (err) {
    // console.error(err);
  }
};

const setExchange = async function (multiplier) {
  try {
    const result = await getExchange();
    console.log(multiplier * result);

    return multiplier * result;
  } catch (err) {
    console.error(err);
  }
};

const reverseExchange = async function (multiplier) {
  try {
    const result = await getExchange();

    const reversed = +(1 / result).toFixed(4);

    console.log(reversed);

    return reversed * multiplier;
  } catch (err) {
    console.error(err);
  }
};

// // Date & time

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  // if (daysPassed === 0) return "Today";
  // if (daysPassed === 1) return "Yesterday";
  // if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// EVENT HANDLERS

btnDeposit.addEventListener("click", async function (e) {
  e.preventDefault();

  // Add movement
  const depositValue = Number(inputDepositAmount.value);
  const descriptionValue = inputDepositDescription.value;

  let convertedValue = Math.round(await reverseExchange(depositValue));
  if (!convertedValue) convertedValue = depositValue * 0.2;

  // const depositDate = new Date().toISOString().slice(0, 10);
  const date = new Date();
  const depositDate = formatMovementDate(date, state.locale);

  if (depositValue > 0) {
    const curMovement = {
      currency: "RON",
      movement: depositValue,
      movementEUR: convertedValue,
      description: descriptionValue,
      type: "deposit",
      date: depositDate,
      id: uuidv4(),
    };

    state.movements.push(curMovement);
    state.itemID++;
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

  let convertedValue = Math.round(await setExchange(depositValue));
  if (!convertedValue) convertedValue = depositValue * 4.87;

  // const depositDate = new Date().toISOString().slice(0, 10);
  const date = new Date();
  const depositDate = formatMovementDate(date, state.locale);

  if (depositValue > 0) {
    const curMovement = {
      currency: "EUR",
      movement: convertedValue,
      movementEUR: depositValue,
      description: descriptionValue,
      type: "deposit",
      date: depositDate,
      id: uuidv4(),
    };

    state.movements.push(curMovement);
    state.itemID++;
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

  let convertedValue = Math.round(await reverseExchange(expenseValue));
  if (!convertedValue) convertedValue = expenseValue * 0.2;

  const date = new Date();
  const expenseDate = formatMovementDate(date, state.locale);

  if (expenseValue > 0) {
    const curMovement = {
      currency: "RON",
      movement: -expenseValue,
      movementEUR: -convertedValue,
      description: descriptionValue,
      type: "expense",
      date: expenseDate,
      id: uuidv4(),
    };

    state.movements.push(curMovement);
    state.itemID++;
    console.log(state.movements);
  }

  // Update UI

  updateUI(state);
  updateStorage(state.movements);

  inputExpenseAmount.value = "";
  inputExpenseDescription.value = "";

  console.log(state.movements);
});

containerMovements.addEventListener("click", function (e) {
  // State deletion
  let item = e.target;
  let itemDataID = item.dataset.id;

  state.movements = state.movements.filter((item) => item.id !== itemDataID);

  console.log(state.movements);

  // Local storage deletion

  updateStorage(state.movements);

  // UI deletion

  // console.log(item);

  // console.log(item.dataset.id);

  // console.log(itemDataID);

  if (!item.classList.contains("del--btn")) return;

  const movementsRow = item.closest(".movements__row");
  movementsRow.parentNode.removeChild(movementsRow);

  updateUI(state);

  console.log(state.itemID);
});

btnSortDescending.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(state.movements, !state.sorted);
  state.sorted = !state.sorted;

  console.log(state.movements);
});

selectedFilter.addEventListener("change", function () {
  selectedFilter.value === "ALL" ? (state.filter = "ALL") : state.filter;
  selectedFilter.value === "RON" ? (state.filter = "RON") : state.filter;
  selectedFilter.value === "EUR" ? (state.filter = "EUR") : state.filter;

  console.log(state.filter);

  displayMovements(state.movements, state.sorted, state.filter);
});

// UI DISPLAY

const displayMovements = function (
  movements,
  sort = state.sorted,
  filter = state.filter
) {
  // empty HTML elements
  containerMovements.innerHTML = "";

  // folosim SLICE ca sa copiem arrayul, pentru ca sort-ul muteaza arrayul original

  let movs = movements;

  if (sort === true && filter === "ALL") {
    movs = movements.slice().sort((a, b) => a.movement - b.movement);
  }

  if (sort === true && filter === "RON") {
    movs = movements
      .slice()
      .sort((a, b) => a.movement - b.movement)
      .filter((elem) => elem.currency === "RON");
  }

  if (sort === true && filter === "EUR") {
    movs = movements
      .slice()
      .sort((a, b) => a.movement - b.movement)
      .filter((elem) => elem.currency === "EUR");
  }

  if (sort === false && filter === "RON") {
    movs = movements.filter((elem) => elem.currency === "RON");
  }

  if (sort === false && filter === "EUR") {
    movs = movements.filter((elem) => elem.currency === "EUR");
  }

  console.log(movs);
  console.log(state.sorted);

  // Loop through movements array
  movs.forEach((mov, i) => {
    const type = mov.type;

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}${
      mov.currency
    }">${i + 1} ${type} ${mov.currency}</div>
          <div class="movements__date">${mov.date}</div>
          <div class="movements__value">${mov.description}</div>
          <div class="movements__value">${mov.movement} RON</div>
          <div class="movements__value">${mov.movementEUR} EUR</div>
          <div class="movements__delete--btn"><i class="fa fa-times del--btn" aria-hidden="true" data-id="${
            mov.id
          }"></i></div>
    </div>
    
    `;
    // Actually adding movements
    containerMovements.insertAdjacentHTML("afterbegin", html);

    //
    calcDisplaySummary(movs);
  });
};

const displayTime = function () {
  const now = new Date();

  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };

  labelDate.textContent = new Intl.DateTimeFormat(state.locale, options).format(
    now
  );
};

const calcDisplayBalance = function (acc) {
  const movementsArr = acc.movements.map((elem) => elem.movement);

  acc.balance = movementsArr.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance} RON`;
};

const calcDisplayBalanceEUR = function (acc) {
  const movementsArr = acc.movements.map((elem) => elem.movementEUR);

  acc.balanceEUR = movementsArr.reduce((acc, mov) => acc + mov, 0);

  labelBalanceEUR.textContent = `${acc.balanceEUR} EUR`;
};

const calcDisplaySummary = function (acc) {
  let movementsArr;

  movementsArr = acc.map((elem) => elem.movement);

  const incomes = movementsArr
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} RON`;

  const out = movementsArr
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} RON`;

  if (state.filter === "EUR") {
    movementsArr = acc.map((elem) => elem.movementEUR);

    const incomes = movementsArr
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes} EUR`;

    const out = movementsArr
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out)} EUR`;
  }
};

const updateUI = function (acc) {
  // Display time

  displayTime();
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display balance EUR

  calcDisplayBalanceEUR(acc);

  // Display summary

  calcDisplaySummary(acc.movements);
};

const init = function () {
  const storage = localStorage.getItem("transactions");
  console.log(storage);
  if (storage) state.movements = JSON.parse(storage);
  console.log(state.movements);
  updateUI(state);
};

init();
