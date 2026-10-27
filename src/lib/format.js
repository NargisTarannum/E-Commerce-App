const whole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const cents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// $68 stays "$68"; $94.5 becomes "$94.50".
export const formatPrice = (value) =>
  Number.isInteger(value) ? whole.format(value) : cents.format(value);