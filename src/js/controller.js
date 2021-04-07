import { v4 as uuidv4 } from "uuid";
import { setExchange, reverseExchange, formatMovementDate } from "./helpers";

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
// const btnSortAscending = document.querySelector(".btn--sort-ascending");

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

// LOCAL STORAGE

const updateStorage = function (newArr) {
  localStorage.setItem("transactions", JSON.stringify(newArr));
};

const clearTransactions = function () {
  localStorage.clear("transactions");
};

// ADD MOVEMENTS

const addMovement = async function (inputAmount, inputDescription, curr, type) {
  let movementValue = Number(inputAmount.value);
  if (movementValue <= 0) return;
  const movementDescription = inputDescription.value;

  let curMovement = {};

  // RON MOVEMENT

  if (curr === "RON") {
    if (type === "expense") movementValue = -movementValue;
    let convertedValue = Math.round(await reverseExchange(movementValue));
    if (!convertedValue) convertedValue = Math.round(movementValue * 0.2);

    curMovement.movement = movementValue;
    curMovement.movementEUR = convertedValue;
  }

  // EUR MOVEMENT

  if (curr === "EUR") {
    let convertedValue = Math.round(await setExchange(movementValue));
    if (!convertedValue) convertedValue = Math.round(movementValue * 4.87);

    curMovement.movement = convertedValue;
    curMovement.movementEUR = movementValue;
  }

  // CREATE MOVEMENT DATE

  const date = new Date();
  const movementDate = formatMovementDate(date, state.locale);

  // CREATE MOVEMENT OBJECT
  curMovement.currency = curr;
  curMovement.description = movementDescription;
  curMovement.type = type;
  curMovement.date = movementDate;
  curMovement.id = uuidv4();

  // ADD MOVEMENT OBJECT TO ARRAY

  state.movements.push(curMovement);
  state.itemID++;

  // RESETTING FIELDS

  inputAmount.value = "";
  inputDescription.value = "";

  // Update UI

  updateUI(state);
  updateStorage(state.movements);
};

// EVENT HANDLERS

btnDeposit.addEventListener("click", function (e) {
  e.preventDefault();
  addMovement(inputDepositAmount, inputDepositDescription, "RON", "deposit");
});

btnDepositEUR.addEventListener("click", function (e) {
  e.preventDefault();
  addMovement(
    inputDepositEuroAmount,
    inputDepositEuroDescription,
    "EUR",
    "deposit"
  );
});

btnExpense.addEventListener("click", function (e) {
  e.preventDefault();
  addMovement(inputExpenseAmount, inputExpenseDescription, "RON", "expense");
});

// SORT MOVEMENTS

const sortClass = function (btn) {
  if (btn.classList.contains("btn--sort-active")) {
    btn.classList.remove("btn--sort-active");
  } else btn.classList.add("btn--sort-active");
};

btnSortDescending.addEventListener("click", function (e) {
  e.preventDefault();

  sortClass(btnSortDescending);

  displayMovements(state.movements, !state.sorted);
  state.sorted = !state.sorted;
});

// FILTER MOVEMENTS

selectedFilter.addEventListener("change", function () {
  selectedFilter.value === "ALL" ? (state.filter = "ALL") : state.filter;
  selectedFilter.value === "RON" ? (state.filter = "RON") : state.filter;
  selectedFilter.value === "EUR" ? (state.filter = "EUR") : state.filter;

  displayMovements(state.movements, state.sorted, state.filter);
  updateUI(state);
});

// DELETE MOVEMENT

containerMovements.addEventListener("click", function (e) {
  // State deletion
  let item = e.target;
  let itemDataID = item.dataset.id;

  state.movements = state.movements.filter((item) => item.id !== itemDataID);

  // Local storage deletion

  updateStorage(state.movements);

  // UI deletion

  if (!item.classList.contains("del--btn")) return;

  const movementsRow = item.closest(".movements__row");
  movementsRow.parentNode.removeChild(movementsRow);

  updateUI(state);
});

// END OF EVENT HANDLERS

// UI DISPLAY

const displayMovements = function (
  movements,
  sort = state.sorted,
  filter = state.filter
) {
  // empty HTML elements
  containerMovements.innerHTML = "";

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

  // Loop through movements array
  movs.forEach((mov, i) => {
    const type = mov.type;

    const html = `
    <div class="movements__row">
     <div class="movements__first--container">
          <div class="movements__type movements__type--${type}${
      mov.currency
    }">${i + 1} ${type} ${mov.currency}</div>
          <div class="movements__date">${mov.date}</div>
       </div>
          <div class="movements__description">${mov.description}</div>
          <div class="movements__value">${mov.movement} RON</div>
          <div class="movements__valueEUR">${mov.movementEUR} EUR</div>
          <div class="movements__delete--btn"><i class="fa fa-times del--btn" aria-hidden="true" data-id="${
            mov.id
          }"></i></div>
    </div>

    `;
    // Actually adding movements
    containerMovements.insertAdjacentHTML("afterbegin", html);
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

// CALCULATE FUNCTIONS

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

  // ALL + RON FILTERING

  movementsArr = acc.map((elem) => elem.movement);

  if (state.filter === "RON")
    movementsArr = acc
      .filter((elem) => elem.currency === "RON")
      .map((elem) => elem.movement);

  const incomes = movementsArr
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} RON`;

  const out = movementsArr
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} RON`;

  // EUR FILTERING

  if (state.filter === "EUR") {
    movementsArr = acc
      .filter((elem) => elem.currency === "EUR")
      .map((elem) => elem.movementEUR);

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

// UPDATE UI

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
  if (storage) state.movements = JSON.parse(storage);
  updateUI(state);
};

init();
