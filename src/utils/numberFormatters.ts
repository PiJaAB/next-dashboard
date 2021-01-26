// @flow
export const currencyFormat = Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  currencyDisplay: 'code',
}).format;

export const numberFormat = Intl.NumberFormat('sv-SE', {
  style: 'decimal',
}).format;
