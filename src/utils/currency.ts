
export const DefaultCurrencyFormat = new Intl.NumberFormat();

export const USCurrencyFormat = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});


