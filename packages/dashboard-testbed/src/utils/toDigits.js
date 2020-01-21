// @flow

export default function toDigits(num: number | string, digits: number): string {
  return String(num).padStart(digits, '0');
}
