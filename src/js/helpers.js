import { API_KEY } from "./config";

// DATE & TIME

export const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  // const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  // if (daysPassed === 0) return "Today";
  // if (daysPassed === 1) return "Yesterday";
  // if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// EXCHANGE API

export const getExchange = async function () {
  try {
    const res = await fetch(
      `https://data.fixer.io/api/latest?access_key=${API_KEY}&base=EUR&symbols=RON,USD`
    );

    const data = await res.json();
    if (!data.success) throw new Error(`${data.error.info}`);

    return data.rates.RON;
  } catch (err) {
    console.error(err);
  }
};

export const setExchange = async function (multiplier) {
  try {
    const result = await getExchange();

    return multiplier * result;
  } catch (err) {
    console.error(err);
  }
};

export const reverseExchange = async function (multiplier) {
  try {
    const result = await getExchange();

    const reversed = +(1 / result).toFixed(4);

    return reversed * multiplier;
  } catch (err) {
    console.error(err);
  }
};
